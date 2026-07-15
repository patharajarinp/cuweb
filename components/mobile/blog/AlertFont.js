export function alertFont(text) {
  var para = document.createElement("div");
  var node = document.createTextNode(text);

  para.appendChild(node);
  para.setAttribute("id", "blog-alert-font");
  //   para.ap
  var element = document.getElementById("blogAlert1");
  element.appendChild(para);
  element.classList.add("blog-alert-font");
  setTimeout(() => {
    element.classList.add("active");
  }, 500);
  setTimeout(() => {
    element.classList.remove("active");
  }, 5500);
  setTimeout(() => {
    var parent = document.getElementById("blogAlert1");
    var child = document.getElementById("blog-alert-font");
    parent.removeChild(child);
  }, 6000);

  // return (
  //     <div>
  //         <div className={`blog-alert-font active`}>
  //             เพิ่มการถูกใจแล้ว
  //         </div>
  //     </div>
  // )
}
