function render(){

    const form=document.getElementById("examForm");

    form.innerHTML="";

    let idx=0;

    mergedQuestions.forEach(item=>{

        if(item.type==="single"){

            form.appendChild(
                createQuestion(item.data, idx)
            );

            idx++;

            return;
        }

        const wrap=document.createElement("div");

        wrap.className="group-block";

        if(item.data.parent){

            const p=document.createElement("div");

            p.className="group-parent";

            p.innerHTML=`
                <div class="group-parent-title">
                    【問題】
                </div>

                <div class="question-text">${renderQuestionText(item.data.parent.question || "")}</div>
                ${renderImageColumn(item.data.parent.image)}
            `;

            wrap.appendChild(p);
        }

        item.data.children.forEach(c=>{

            wrap.appendChild(
                createQuestion(c, idx)
            );

            idx++;
        });

        form.appendChild(wrap);
    });
}


/* ------------------------------
   問題文表示
------------------------------ */
function renderQuestionText(text){

    if(!text) return "";

    return text.split(/(\[img\s*:[^\]\r\n]+\])/gi)
        .map((part, index) => index % 2
            ? renderImage(part.slice(part.indexOf(":") + 1, -1))
            : esc(part).replace(/\n/g, "<br>"))
        .join("");
}

function renderImageColumn(image){
    return renderImage(image);
}

function renderImage(path){
    const relativePath = (path || "").trim()
        .replace(/\\/g, "/")
        .replace(/^(?:\.\/)+/, "")
        .replace(/^images\//i, "");

    if(!relativePath) return "";

    const src = relativePath.split("/").map(encodeURIComponent).join("/");
    const fileName = esc(relativePath).replace(/"/g, "&quot;");

    return `
        <div class="question-image-wrap">
            <img
                src="images/${src}"
                alt="図：${fileName}"
                class="question-image"
                loading="lazy"
                onerror="this.hidden=true;this.nextElementSibling.hidden=false"
            >
            <span hidden>図を読み込めません（${fileName}）。</span>
        </div>
    `;
}

function createQuestion(q,i){

    const d=document.createElement("div");

    d.className="question";

    const type=(q.type||"").toLowerCase();

    d.innerHTML += `
        <p>問題${i+1}（${q["配点"]||0}点）</p>
    `;

    /* ------------------------------
       コード問題
    ------------------------------ */
    if(type==="pg"){

        d.innerHTML += `
            <pre class="code-block">
${esc(q.question || "")}
            </pre>
        `;

        d.innerHTML += renderImageColumn(q.image);

        d.innerHTML += `
            <textarea name="q${i}"></textarea>
        `;

        return d;
    }

    /* ------------------------------
       通常問題
    ------------------------------ */
    d.innerHTML += `
        <div class="question-text">${renderQuestionText(q.question || "")}</div>
    `;

    d.innerHTML += renderImageColumn(q.image);

    if(type==="normal") return d;

    /* ------------------------------
       選択問題
    ------------------------------ */
    if(type==="select"||type==="fill"){

        [
            q.choice1,
            q.choice2,
            q.choice3,
            q.choice4,
            q.choice5,
            q.choice6,
            q.choice7,
            q.choice8,
            q.choice9,
            q.choice10
        ]
        .filter(c=>c)
        .forEach(c=>{

            d.innerHTML += `
                <label>
                    <input
                        type="radio"
                        name="q${i}"
                        value="${esc(c)}"
                    >
                    ${esc(c)}
                </label>
            `;
        });

    }else{

        d.innerHTML += `
            <textarea name="q${i}"></textarea>
        `;
    }

    return d;
}