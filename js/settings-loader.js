/* 別管理の設定を受験開始時に読み込み、受験中は固定します。 */
let activeExamSettings=null;
function resolveExamSettings(config, code){
 if(!config || config.version!==1 || !config.defaults || !config.exams || Array.isArray(config.exams)) throw new Error('設定ファイルの形式・バージョンが不正です。');
 const override=Object.prototype.hasOwnProperty.call(config.exams,code)?config.exams[code]:{};
 if(!override || typeof override!=='object' || Array.isArray(override))throw new Error('試験コード別の設定が不正です。');
 const values={...config.defaults,...override};
 if(typeof values.shuffleQuestions!=='boolean'||typeof values.shuffleChoices!=='boolean')throw new Error('シャッフル設定には true または false を指定してください。');
 return Object.freeze({shuffleQuestions:values.shuffleQuestions,shuffleChoices:values.shuffleChoices,version:config.version});
}
async function readExamSettings(code){
 activeExamSettings=null;
 delete window.EXAM_SETTINGS;
 await new Promise((resolve,reject)=>{
  const script=document.createElement('script');
  script.src='config/exam-settings.js?updated='+Date.now();
  const timeout=setTimeout(()=>finish(new Error('設定読み込みがタイムアウトしました。')),15000);
  function finish(error){clearTimeout(timeout);script.remove();error?reject(error):resolve();}
  script.onload=()=>finish();script.onerror=()=>finish(new Error('config/exam-settings.js を読み込めません。配置を確認してください。'));
  document.head.appendChild(script);
 });
 activeExamSettings=resolveExamSettings(window.EXAM_SETTINGS,code);
}
