import { defineStore } from 'pinia';
import { ref } from 'vue';
import heartimg from '@/assets/heart.png';
import { heartParametersService, wenxinService } from '@/api/doc.js'; // 确保引入服务  
import { downloadPDF } from '@/utils/htmlToPdf.js'; // 新增引入 
import { ChatService } from '@/api/wenxin';
import { marked } from 'marked';

const useDocStore = defineStore('document', () => {
    const heartParameters = ref({
        id: 1,
        age: 18,
        sex: '男',
        cp: 0,
        trestbps: 120,
        chol: 200,
        fbs: 0,
        restecg: 0,
        thalach: 150,
        exang: 0,
        oldpeak: 1.0,
        ca: 0,
        thal: 1
    });

    const images = ref([heartimg]);
    const suggestedAdvice = ref("根据心脏参数，建议定期检查并保持健康的生活方式。如有进一步不适，请及时就医。");
    const parsedMessage = ref();

    const fetchHeartParameters = async (fileId) => {
        const Id = {
            id: fileId
        };
        console.log(Id);
        try {
            const response = await heartParametersService(Id);
            if (response.code === 0) {
                const data = response.data;

                // 为每个字段设置默认值，如果为空则使用默认值
                heartParameters.value = {
                    id: data.id || heartParameters.value.id,
                    age: data.age !== null ? data.age : 18,
                    sex: data.sex || '男',
                    cp: data.cp !== null ? data.cp : 0,
                    trestbps: data.trestbps !== null ? data.trestbps : 120,
                    chol: data.chol !== null ? data.chol : 200,
                    fbs: data.fbs !== null ? data.fbs : 0,
                    restecg: data.restecg !== null ? data.restecg : 0,
                    thalach: data.thalach !== null ? data.thalach : 150,
                    exang: data.exang !== null ? data.exang : 0,
                    oldpeak: data.oldpeak !== null ? data.oldpeak : 1.0,
                    ca: data.ca !== null ? data.ca : 0,
                    thal: data.thal !== null ? data.thal : 1
                };

                console.log(heartParameters.value)
            } else {
                console.error('Error fetching heart parameters:', response.message);
            }
        } catch (error) {
            console.error('Error fetching heart parameters:', error);
        }
    };

    const fetchWenxinAdvice = async (doctorAdvice) => {
        // 构造提问内容
        const message = `
        医生的建议如下：
        "${doctorAdvice}"
        
        现在，我正在处理一组心脏健康相关的数据，其中包含多个字段：
        - age（年龄）：${heartParameters.value.age}，表示对象的年龄。
        - sex（性别）：${heartParameters.value.sex}，表示对象的性别，取值范围为 female 和 male。
        - cp（胸部疼痛类型）：${heartParameters.value.cp}，痛感由重到轻依次为 typical、atypical、non-anginal 和 asymptomatic。
        - trestbps（血压）：${heartParameters.value.trestbps}，表示血压数值。
        - chol（胆固醇）：${heartParameters.value.chol}，表示胆固醇数值。
        - fbs（空腹血糖）：${heartParameters.value.fbs}，当血糖含量大于120mg/dl时为 true，否则为 false。
        - restecg（心电图结果）：${heartParameters.value.restecg}，表示心电图结果，取值范围为 norm 和 hyp。
        - thalach（最大心跳数）：${heartParameters.value.thalach}，表示最大心跳数。
        - exang（运动时是否心绞痛）：${heartParameters.value.exang}，表示是否在运动时有心绞痛，true 为是，false 为否。
        - oldpeak（运动相对于休息的ST depression）：${heartParameters.value.oldpeak}，表示 ST 段压数值。
        - slop（心电图ST segment的倾斜度）：${heartParameters.value.slop}，表示 ST segment 的倾斜度，取值范围为 down、flat 和 up。
        - ca（透视检查看到的血管数）：${heartParameters.value.ca}，表示透视检查看到的血管数。
        - thal（缺陷种类）：${heartParameters.value.thal}，表示并发种类，取值范围为 norm、fix 和 rev。
        - status（是否患病）：${heartParameters.value.status}，表示对象是否患病，取值范围为 buff 和 sick。

        请基于以上信息，并结合医生的建议，站在医生的角度给我提供一个段落形式的建议。可以参考以下模板：
        
        鉴于您... 我建议您...
    `;

        try {
            // 调用 API 获取响应
            const response = await ChatService({ question: message });
            let advice = response.data; // 假设响应数据在 response.data 中

            // 裁剪建议内容
            const suggestionIndex = advice.indexOf("建议：");
            if (suggestionIndex !== -1) {
                advice = advice.slice(suggestionIndex + 3); // 只保留“建议：”后的内容
            }
            suggestedAdvice.value = advice !== null ? advice : "根据心脏参数，建议定期检查并保持健康的生活方式。如有进一步不适，请及时就医。"; // 假设响应数据在 response.data 中
            console.log(suggestedAdvice.value);
            parsedMessage.value = marked(suggestedAdvice.value);
        } catch (error) {
            console.error('API 请求失败:', error);
        }
    };


    const addImage = (image) => {
        images.value.push(image);
    };

    // 生成 PDF 的函数  
    const generatePDF = async () => {
        const pdfContent = document.getElementById("pdf-content"); // 替换为你的 HTML 内容的 ID  
        if (!pdfContent) {
            console.error("未找到要渲染的内容");
            return;
        }
        // 调用 utils 下载 PDF 方法  
        await downloadPDF(pdfContent);
    };

    return {
        heartParameters,
        suggestedAdvice,
        parsedMessage,
        fetchHeartParameters,
        fetchWenxinAdvice,
        addImage,
        generatePDF
    };
}, { persist: true });

export default useDocStore;