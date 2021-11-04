let editorInput = document.getElementById("editor");
let resultOutput = document.getElementById("result");

let cmEditor = CodeMirror.fromTextArea(document.getElementById('cmEditor'), {
  mode: "markdown",
  lineNumbers: true,
  lineWrapping: true,
  indentUnit: 4
});

cmEditor.setSize("100%", "100%");

console.log(cmEditor);

cmEditor.on("change", () => {
  resultOutput.innerHTML = marked(cmEditor.getValue());
  hljs.highlightAll();
});

cmEditor.on("focus", () => {
  let editorval = cmEditor.getValue();
  if (editorval === "シンプルなMDエディタです。\nこちら側にテキストを入力してください。") {
    let editordoc = cmEditor.getDoc();
    editordoc.setValue("");
  }
});


//ファイル書き出し
let form = document.getElementById("form");
form.addEventListener("submit", () => {
  const fileOutputName = document.getElementById(`fileoutputname`).value;
  let val = cmEditor.getValue();
  let blob = new Blob([val], { type: "text/markdown" });
  let link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `${fileOutputName}.md`;
  link.click();
});

//ファイル読み込み
form.addEventListener("change", (e) => {
  let file = e.target.files;
  let reader = new FileReader();
  reader.readAsText(file[0]);
  reader.onload = () => {
    let doc = cmEditor.getDoc();
    doc.setValue(reader.result);
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
    $('.tab li').find('a').each(function () { //タブ内のaタグ全てを取得
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
  toggleEditor(idName);
  //  return false;//aタグを無効にする
});