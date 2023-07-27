# 使用Node.js官方提供的Node镜像作为基础镜像
FROM node:14

# 设置工作目录为容器内的/app目录
WORKDIR /app

# 将本地的package.json和package-lock.json拷贝到容器内的/app目录
COPY package*.json ./

# 安装项目依赖
RUN npm install

# 将本地的所有文件拷贝到容器内的/app目录
COPY . .

# 暴露容器的端口，注意这里的端口要和Express应用监听的端口一致
EXPOSE 3000

# 启动Express应用
CMD ["npm", "dev"]
