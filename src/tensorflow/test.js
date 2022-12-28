import * as tf from '@tensorflow/tfjs'
import * as d3 from 'd3'
import moment from "moment";
import express from 'express'
const test = express.Router();

// 机器学习 LSTM

const STEP_SIZE = 6;
const STEP_NUM = 24;
const STEP_OFFSET = 1;
const TARGET_SIZE = 24;
const LSTM_UNITS = 30;

const X_LEN = STEP_SIZE + STEP_OFFSET * (STEP_NUM - 1);
const Y_LEN = TARGET_SIZE;

const config = {
    epochs: 30, // 迭代次数
    batchSize: 4, // 样本量
};

async function loadData(path) {
    return await d3.csv(path);
}

function buildX(data, stepSize, stepNum, stepOffset) {
    let xData = [];
    for (let n = 0; n < stepNum; n++) {
        const startIndex = n * stepOffset;
        const endIndex = startIndex + stepSize;
        const item = data.slice(startIndex, endIndex).map((obj) => obj.value);
        xData.push(item);
    }
    return xData;
}

function makeTrainData(data, stepSize, stepNum, stepOffset, targetSize) {
    const trainData = {
        x: [],
        y: [],
    };

    const length = data.length;

    const xLength = stepSize + stepOffset * (stepNum - 1);
    const yLength = targetSize;
    const stopIndex = length - xLength - yLength;

    for (let i = 0; i < stopIndex; i++) {
        const x = data.slice(i, i + xLength);
        const y = data.slice(i + xLength + 1, i + xLength + 1 + yLength);

        const xData = buildX(x, stepSize, stepNum, stepOffset);
        const yData = y;

        trainData.x.push(xData.map((item) => item));
        trainData.y.push(yData.map((item) => item.value));
    }
    return trainData;
}

function buildModel() {
    const model = tf.sequential();

    //lstm input layer
    const hidden1 = tf.layers.lstm({
        units: LSTM_UNITS,
        inputShape: [STEP_NUM, STEP_SIZE],
        returnSequences: true,
    });

    model.add(hidden1);

    //2nd lstm layer
    const output = tf.layers.lstm({
        units: TARGET_SIZE,
        returnSequences: false,
    });

    model.add(output);

    model.add(
        tf.layers.dense({
            units: TARGET_SIZE,
        })
    );

    model.add(
        tf.layers.activation({
            activation: "tanh",
        })
    );

    //compile
    const rmsprop = tf.train.rmsprop(0.005);
    model.compile({
        optimizer: rmsprop,
        loss: tf.losses.meanSquaredError,
    });

    return model;
}

async function predict(model, input) {
    const prediction = await model.predict(tf.tensor([input])).data();
    return prediction;
}

async function trainBatch(data, model) {

    console.log("training start!");
    const epochs = config.epochs;
    const results = [];
    const xs = tf.tensor3d(data.x);
    const ys = tf.tensor2d(data.y);

    const history = await model.fit(xs, ys, {
        batchSize: config.batchSize,
        epochs: config.epochs,
        validationSplit: 0.2,
    });

    console.log("training complete!");
    return history;
}

async function startPredict(rawData) {
    const airPassagnerData = await loadData(
        "https://cdn.jsdelivr.net/gh/gangtao/datasets@master/csv/air_passengers.csv"
    );

    // const airPassagnerData = rawData;
    console.log("获取的原始数据", airPassagnerData);

    // Normalize data with value change
    let changeData = [];

    // 求平均值
    let tempArr = [];
    function avg() {
        let tempSum = 0;
        airPassagnerData.map((item) => {
            let temp = parseInt(item.Number);
            tempSum += temp;
            tempArr.push(temp);
        });
        let avg = tempSum / airPassagnerData.length;
        return avg;
    }
    let avgNum = avg();
    console.log("平均值", avgNum);
    console.log("tf平均值");
    tf.mean(tf.tensor1d(tempArr)).print();
    //求数组标准差
    function stdDeviation(arr) {
        let sd,
            ave,
            sum = 0,
            sums = 0,
            len = arr.length;
        for (let i = 0; i < len; i++) {
            sum += Number(arr[i]);
        }
        ave = sum / len;
        for (let i = 0; i < len; i++) {
            sums += (Number(arr[i]) - ave) * (Number(arr[i]) - ave);
        }
        sd = Math.sqrt(sums / len);
        return sd;
    }
    let std = stdDeviation(tempArr);
    console.log("标准差", std);
    console.log("tf标准差");
    let a = tf.tensor1d(tempArr);
    tf.moments(a).variance.sqrt().print();

    for (let i = 1; i < airPassagnerData.length; i++) {
        const item = {};
        item.date = airPassagnerData[i].Date;
        const val = parseInt(airPassagnerData[i].Number);
        const val0 = parseInt(airPassagnerData[i - 1].Number);
        // if (val0 ==0) {
        // 	item.value = val / 1 - 1
        // } else {
        item.value = val / val0 - 1;
        // }
        // item.value = (val - avgNum) / std;
        changeData.push(item);
    }

    console.log("标准化数据", changeData);

    const trainData = makeTrainData(
        changeData,
        STEP_SIZE,
        STEP_NUM,
        STEP_OFFSET,
        TARGET_SIZE
    );

    const model = buildModel();
    model.summary();

    const history = await trainBatch(trainData, model);

    const inputStart = changeData.length - X_LEN;
    const inputEnd = changeData.length;
    const input = changeData.slice(inputStart, inputEnd);
    const predictInput = buildX(input, STEP_SIZE, STEP_NUM, STEP_OFFSET);
    const prediction = await predict(model, predictInput);

    // re-constructe predicted value based on change
    const base = airPassagnerData[airPassagnerData.length - 1];
    const baseDate = moment(new Date(base.Date));
    const baseValue = parseInt(base.Number);

    let predictionValue = [];
    let val = baseValue;
    for (let i = 0; i < prediction.length; i += 1) {
        const item = {};
        const date = baseDate.add(1, "day");
        item.time = moment(date).format("YYYY-MM-DD");
        item.value = val + val * prediction[i];
        item.isPrediction = "Yes";
        predictionValue.push(item);
        val = item.value;
    }

    console.log(predictionValue);
    let airPassagnerDataWithPrediction = [];

    predictionValue.forEach((item) => {
        airPassagnerDataWithPrediction.push(item);
    });

}

test.get('/',(req,res)=> {
    startPredict();
    res.send('1')
})
export default  test;

