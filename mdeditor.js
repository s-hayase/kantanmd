let editorInput = document.getElementById("editor");
let resultOutput = document.getElementById("result");

let cmEditor = CodeMirror.fromTextArea(document.getElementById('cmEditor'), {
  mode: "markdown",
  lineNumbers: true,
  lineWrapping: true,
  indentUnit: 4
});

cmEditor.setSize("100%", "100%");

cmEditor.on("change", () => {
  resultOutput.innerHTML = marked.parse(cmEditor.getValue());
  hljs.highlightAll();
});

cmEditor.on("focus", () => {
  let editorval = cmEditor.getValue();
  if (editorval === "シンプルなMDエディタです。\nこちら側にテキストを入力してください。") {
    let editordoc = cmEditor.getDoc();
    editordoc.setValue("");
  }
});

init();

//ファイル書き出し

document.getElementById('fileoutput').addEventListener("click", () => {
  console.log('A');
  const fileOutputName = document.getElementById(`fileoutputname`).value;
  let val = cmEditor.getValue();
  let blob = new Blob([val], { type: "text/markdown" });
  let link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `${fileOutputName}.md`;
  link.click();
});

//ファイル読み込み
document.getElementById('fileload').addEventListener("change", (e) => {
  let file = e.target.files;
  let reader = new FileReader();
  reader.readAsText(file[0]);
  reader.onload = () => {
    let doc = cmEditor.getDoc();
    doc.setValue(reader.result);
  }
});

// ローカルに保存
document.getElementById(`filesavelocal`).addEventListener("click", () => {
  let editorval = cmEditor.getValue();
  alert('Memo' + localStorage.length+'保存が完了しました。');
  localStorage.setItem('Memo' + localStorage.length, editorval);
  let idname = 'Memo'+(localStorage.length-1);
  addList(idname);
});

function init(){
  if (localStorage.length === 0) {
    alert('メモは登録されていません。');
    return;
  }
    createList();
}

function createList(){
  for (key in localStorage) {
    if(key === 'weblioObjFlg'){
      localStorage.removeItem('weblioObjFlg');
    }
    if (localStorage.hasOwnProperty(key)) {
        addList(key);
    }
  }
}

function addList(idname){
  let localfilelist = document.getElementById(`localfilelist`);
  localfilelist.insertAdjacentHTML('afterbegin','<li><a href = # id = "'+idname+'">'+idname +'</a></li>');
  document.getElementById(idname).addEventListener('click',()=>{
    localfileload(idname);
});
}

function localfileload(Memoname){
  if(confirm(Memoname+'を読み込んでもいいですか')){
    console.log(localStorage.getItem(Memoname));
  let MemoData = localStorage.getItem(Memoname);
  let doc = cmEditor.getDoc();
  doc.setValue(MemoData);
  }
}

//ローカルクリア
document.getElementById(`filedellocal`).addEventListener("click", () => {
  if(confirm('本当に削除しますか？')){
    document.getElementById(`localfilelist`).innerHTML = "";
    localStorage.clear();
  }
});



$(".openbtn").click(function () {//ボタンがクリックされたら
  $(this).toggleClass('active');//ボタン自身に activeクラスを付与し
  $("#g-nav").toggleClass('panelactive');//ナビゲーションにpanelactiveクラスを付与
});


$("#g-nav a").click(function () {//ナビゲーションのリンクがクリックされたら
  $(".openbtn").removeClass('active');//ボタンの activeクラスを除去し
  $("#g-nav").removeClass('panelactive');//ナビゲーションのpanelactiveクラスも除去
});


//任意のタブにURLからリンクするための設定
function toggleTabAcvive(onclickTabName) {
  if (onclickTabName) {
    //タブ設定
    $('.tab li a').each(function () { //タブ内のaタグ全てを取得
      let tabName = $(this).attr('href'); //タブ内のaタグのリンク名 
      if (onclickTabName == tabName) { //リンク元の指定されたURLのハッシュタグ
        let parentElm = $(this).parent(); //タブ内のaタグの親要素（li）を取得

        $('.tab li').removeClass("active"); //タブ内のliについているactiveクラスを取り除き
        $(parentElm).addClass("active"); //リンク元の指定されたURLのハッシュタグとタブ内のリンク名が同じであれば、liにactiveクラスを追加
      }
    });
  }
}

//タブ遷移
let mode ="normal";
function toggleEditor(onclickTabName) {
  let cm = $('.CodeMirror')[0].CodeMirror;
  switch (mode) {
    case "normal":
      switch (onclickTabName) {
        case "#modeEdit":
        mode = "edit";
        $(".content").addClass("cotentEditorOnly");
        $("#editor").addClass("editorarea");
        $("#result").removeClass("editorarea");
        $("#result").hide();
          break;
        case "#modeResult":
          mode = "result";
          $(".content").addClass("cotentResultOnly");
          $("#result").addClass("resultarea");
          $("#editor").removeClass("editorarea");
          $(cm.getWrapperElement()).hide();
          $("#result").show();
        break;
        default:
          break;
      }
      break;
    case "edit":
      switch (onclickTabName) {
        case "#modeEdit":
          mode = "normal";
          $(".content").removeClass("cotentEditorOnly");
          $("#result").addClass("editorarea");
          $("#result").show();
          break;
        case "#modeResult":
          $(".content").removeClass("cotentEditorOnly");
          $(".content").addClass("cotentResultOnly");
          $("#editor").removeClass("editorarea");
          $(cm.getWrapperElement()).hide();
          $("#result").addClass("editorarea");
          $("#result").show();
           mode = "result";
        break;
        default:
          break;
      }

      break;
    case "result":
        switch (onclickTabName) {
        case "#modeEdit":
          mode = "edit";
          $(".content").removeClass("cotentResultOnly");
          $(".content").addClass("cotentEditorOnly");
          $("#result").removeClass("editorarea");
          $("#editor").addClass("editorarea");
          $(cm.getWrapperElement()).show();
          $("#result").hide();
          break;
        case "#modeResult":
          mode = "normal";
          $(".content").removeClass("cotentResultOnly");
          $("#editor").addClass("editorarea");
          $(cm.getWrapperElement()).show();
        break;
        default:
          break;
      }
    default:
      break;
  }

}

//タブをクリックしたら
$('.tab a').on('click', function () {
  let idName = $(this).attr('href'); //タブ内のリンク名を取得  
  toggleTabAcvive(idName);//設定したタブの読み込みと
  toggleEditor(idName);//aタグを無効にする
});
