const markdownInput = document.getElementById("markdown-input");
const htmlOutput = document.getElementById("html-output");
const preview = document.getElementById("preview");

markdownInput.addEventListener("input", ()=> {
  let htmlStr = convertMarkdown();
  htmlOutput.innerText = htmlStr;
  preview.innerHTML = htmlStr;
});

function convertMarkdown() {
  let str = markdownInput.value.trim();
  
  const headerRegex = /^#{1,6} +/g;
  const quoteRegex = /^> /;
  const strongRegex = /^[*]{2}(.*)[*]{2}$|^_{2}(.*)_{2}$/s;
  const italicRegex = /^[*](.*)[*]$|^_(.*)_$/m;
  const imageRegex = /[!][[]alt-(\w+)][(]image-(\w+)[)]/;
  const linkRegex = /^[[]([\w ]+)][(](\w+)[)]$/s;

  if(headerRegex.test(str)) {
    //handles headers
    str = str.split(`\n`);
    let formatArr = [];
    for(let s of str) {
      let headerType = s.match(headerRegex)[0].trim().length();
      let textContent = s.replace(headerRegex, "");
      formatArr.push([headerType, textContent]);
    }
    //let matched = str.map(s => s.match(headerRegex));
    //let noMarkdownStr = str.replace(headerRegex, "").replace(/ +/g, " ");
    return formatArr.map(m => `<h${m.headerType}>${m.textContent}</h${m.headerType}>`).join("");
  } else if(strongRegex.test(str)){
    //handles strong
    let noMarkdownStr = str.replace(strongRegex, "$1$2").replace(/\s+/g, " ");
    return `<p><strong>${noMarkdownStr}</strong></p>`;
  }else if(italicRegex.test(str)){
    //handles italic
    let noMarkdownStr = str.replace(italicRegex, "$1$2").replace(/\s+/g, " ");
    return `<em>${noMarkdownStr}</em>`;
  } else if(imageRegex.test(str)){
    //handles image
    let src = str.replace(imageRegex, "$1");
    let alt = str.replace(imageRegex, "$2");
    return `<img src=${src} alt=${alt}/>`;
  }else if(linkRegex.test(str)){
    //handles link
    let link = str.replace(linkRegex, "$1");
    let URL = str.replace(linkRegex, "$2");
    return `<a href=${URL}>${link}</a>`;
  }else if(quoteRegex.test(str)) {
    //quote headers
    let noMarkdownStr = str.replace(quoteRegex, "").replace(/\s+/g, " ");
    return `<blockquote>${noMarkdownStr}</blockquote>`;
  } else {
    return markdownInput.value;
  }
  
  }