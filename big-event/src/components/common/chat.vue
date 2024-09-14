<template>  
  <div class="chat-container">  
    <div class="chat-window">  
      <div class="message-list">  
        <div   
          v-for="(msg, index) in messages"   
          :key="index"   
          class="message"   
          :class="{ 'user-message': msg.isUser }"  
        >  
          <span class="markdown-content" v-if="msg.isUser">{{ msg.text }}</span>  
          <span class="markdown-content" v-else v-html="msg.text"></span> <!-- 修正为使用 span 标签关闭 v-html -->
        </div>  
      </div>  
    </div>  
    <div class="input-container">  
      <input   
        v-model="userInput"   
        @keyup.enter="sendMessage"   
        placeholder="输入你的消息..."  
      />  
      <button @click="sendMessage">发送</button>  
    </div>  
  </div>  
</template>  

<script setup>  
import { ref } from 'vue';  
import { ChatService } from '@/api/wenxin';  
import { marked } from 'marked'; // 假设需要对 Markdown 格式进行处理

const userInput = ref('');  
const messages = ref([]);  

const sendMessage = async () => {  
  const trimmedMessage = userInput.value.trim();  
  if (trimmedMessage) {  
    // 添加用户消息到消息列表  
    messages.value.push({ text: trimmedMessage, isUser: true });  
    userInput.value = ''; // 清空输入框  

    try {  
      // 调用 API 获取响应  
      const response = await ChatService({ question: trimmedMessage });  
      const responseMessage = response.data; // 假设响应数据在 response.data 中  
      
      // 使用 marked 解析 Markdown，或直接使用 HTML
      const parsedMessage = marked(responseMessage);  
      
      messages.value.push({ text: parsedMessage, isUser: false });  
    } catch (error) {  
      console.error('API 请求失败:', error);  
      messages.value.push({ text: '发送消息失败，请稍后再试。', isUser: false });  
    }  
  }  
};  
</script>  

<style scoped>  
@import url(../../assets/css/markdown-highlight.css);

.chat-container {  
  width: 800px;  
  margin: auto;
  padding: 20px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  height: 500px;  
  border: 1px solid #ddd;  
  border-radius: 8px;  
  display: flex;  
  flex-direction: column;  
}  

.chat-window {  
  flex: 1;  
  overflow-y: auto;  
  padding: 10px;  
}  

.message-list {  
  display: flex;  
  flex-direction: column;  
}  

.message {  
  padding: 8px;  
  margin: 5px 0;  
  border-radius: 4px;  
  max-width: 70%; /* 限制消息的最大宽度 */
  word-wrap: break-word; /* 自动换行 */
}  

.user-message {  
  background-color: #d1e7dd;  
  align-self: flex-end;  
}  

.input-container {  
  display: flex;  
  padding: 10px;  
}  

input {  
  flex: 1;  
  padding: 8px;  
  border: 1px solid #ddd;  
  border-radius: 4px;  
}  

button {  
  margin-left: 10px;  
  padding: 8px 12px;  
  background-color: #007bff;  
  color: #fff;  
  border: none;  
  border-radius: 4px;  
  cursor: pointer;  
}  
</style>
