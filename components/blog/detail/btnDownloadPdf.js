import React,{useEffect,useState} from 'react'
import pdfMake from "pdfmake/build/pdfmake";
// import pdfFonts from "pdfmake/build/vfs_fonts";
import pdfFonts from "../../../fonts_pdf/build/vfs_fonts";
import htmlToPdfmake from "html-to-pdfmake"
import LOGO from './pdfLine'
// var jsdom = require("jsdom");
// var { JSDOM } = jsdom;
// var { window } = new JSDOM("");


pdfMake.vfs = pdfFonts.pdfMake.vfs;

pdfMake.fonts = {
  CHULALONGKORN: {
    normal: 'Kanit-Regular.ttf',
    bold: 'Kanit-Bold.ttf',
    italics: 'Kanit-Italic.ttf',
    bolditalics: 'Kanit-BoldItalic.ttf'
  },
  Roboto: {
    normal: 'Roboto-Regular.ttf',
    bold: 'Roboto-Medium.ttf',
    italics: 'Roboto-Italic.ttf',
    bolditalics: 'Roboto-MediumItalic.ttf'
  }
}
export default function BtnDownloadPdf({ status, data ,title,writer}) {
const [divpdf, setdivpdf] = useState(`
<p>&nbsp; &nbsp; ที่สุดขอบจักรวาลของใครสักคน นางหิมะ หมีขาว และลูกแมวน้ำ อาศัยอยู่บนแผ่นน้ำแข็งแผ่นหนึ่ง ลอยเท้งเต้งกลางมหาสมุทรของจักรวาล หนาว แต่ไม่เหน็บ</p>
<p>&nbsp;</p><p>&nbsp; &nbsp;ไม่มีใครแน่ใจว่าเพราะมีนางหิมะ จึงมีความหนาว หรือเพราะมีความหนาวจึงมีนางหิมะ แต่ทั้งสาม นางหิมะหมีขาวและลูกแมวน้ำก็อยู่ด้วยกันมาเนิ่นนาน</p>
<p>&nbsp;</p><p>&nbsp; &nbsp;นางหิมะคือหญิงสาวชุดขาว ผิวขาวเล็บขาว ผมขาว ขนตาขาวแต่ดวงตาและกลีบปากเป็นสีฟเหมือนสีของน้ำในมหาสมุทรของจักรวาล เหมือนสีผืนฟ้าของสุดขอบจักรวาล</p>
<p>&nbsp;</p><p>&nbsp; &nbsp;หมีขาวคือหมีขาว ขนขาว ตาและจมูกคำชอบเล่นเอาอุ้งมือปิดจมูกและตาเพราะเชื่อว่าจะไม่มีใครหาตนเองเจอในดินแดนสีขาว</p><p>&nbsp;</p>
<p>&nbsp; &nbsp;ลูกแมวน้ำคือลูกแมวน้ำขนขาว ตาและจมูกดำเหมือนหมีขาว แตไม่ชอบเล่นเอามือปิดจมูกเหมือนหมีขาว ลูกแมวน้ำบอกว่ามันดูงี่เง่า</p><p>&nbsp;</p>
<p>&nbsp; &nbsp;หมีขาวไม่โกรธ แก่คิดว่าเพราะลูกแมวน้ำเอื้อมมือมาปิดจมูกไม่ได้เลยพูดแบบนั้นแต่นั่นแหละที่ทำให้ลูกแมวน้ำงอนตุ๊บปอง</p><p>&nbsp;</p>
<p>&nbsp; &nbsp;และทุกครั้งที่ลูกแมวน้ำงอนจนตัวกลม นางหิมะต้องบันดาลให้หิมะตกลงมาเพื่อที่หมีขาวจะปั้นสโนว์แมนง้อลูกแมวน้ำ</p>
<figure className="image"><img src="http://192.168.6.19:8080/upload/images/1594490302059.jpg"></figure>

`)
const [imgLogo, setimgLogo] = useState()
const printPDF=(e)=>{
  var now = new Date();
  var jsDate = now.getDate()+'-'+(now.getMonth()+1)+'-'+now.getFullYear();
var element = document.getElementById(`pdft${data.id}`);
var elementHtml = element.outerHTML;
  // console.log('object', elementHtml)
  var html = htmlToPdfmake(elementHtml,{
    defaultStyles:{ // change the default styles
      p: {margin:[0, 5, 0, 10]}
    }
  });
  var docDefinition = {
    pageSize: 'A4',
    background: [
      {
          svg:LOGO ,
          width: 595,
          height: 842
      }
    ],
    pageMargins: [ 56, 30, 56, 30 ],
    // header: function() {
    //   return {
    //     columns: [
    //       {
    //         alignment: 'center',
    //         fontSize: 14,
    //         text: `ตอนที่ ${data.index} ${data.title}`,
    //         image: 'icon/logo.svg'
    //       }
    //     ],
    //     margin: [30, 15, 30, 0], height: 100,
    //   }},
      
    footer: function(currentPage, pageCount) { 
    return {
      columns: [
        // {
        //   alignment: 'left',
        //   text: ['Created on: ', { text: jsDate.toString() }]
        // },
        {
          alignment: 'right',
          text: ['page ', { text: currentPage.toString() },	' of ',	{ text: pageCount.toString() }]
        }
      ],
      margin: [10,10]
    }}
    ,
    content: [
      {
        columns: [
          {
            layout:'noBorders',
          table: {
            body: [
              [{text: `เรื่อง : ${title}`}],
              // [{text: `ตอนที่ : ${data.index} ${data.title}`}],
              [{text: `ผู้เขียน : ${writer.penname1}`,fontSize: 10,color:'#555559'}]
            ]
          }
          // alignment: 'right',
          // columns: [{text: `ตอนที่ ${data.index} ${data.title}`,}],
         
          
        },
        {
          image: imgLogo,
          width: 50,
          alignment: 'right'
        },
        
        
        
      ],
      columnGap: 10
    },
    {
      layout:'noBorders',
     
      table: {
         widths: ['100%'],
          body: [
            [{text: ''}],
            [{text: `ตอนที่ : ${data.index} ${data.title}`,alignment: 'center', fillColor: '#FBF4E1'}],
            [{text: ''}]
          ]
        }
    },
      html
    ],

    defaultStyle:{
      font:'CHULALONGKORN'
    },
   styles:{
      // textd:{
      //   color:'red'
      // },
      image:{
        alignment: 'center',
        italics: true,
      },
      images:{

        alignment: 'left',
        italics: true,
      },
      imagesR:{
        alignment: 'right',
        italics: true,
      },
      headpdf:{
        "widths": 100,
        // "heights": [ 75, 151 ]
      },
      // 'image image-style-align-left image_resized': {
      //   float: 'left',
      //   marginRight: 1,
      //   "widths": 100,
      //   "heights": 100,
      //   maxWidth: '100%',
      //   display: 'block',
      //   boxSizing: 'border-box'
      // },
    // 'image-style-align-right':{
    //     float: 'right',
    //     marginLeft: 1
    // },
    // 'image_resized':{
        // maxWidth: '100%',
        // display: 'block',
        // boxSizing: 'border-box'
    // }
    }
  };
  pdfMake.createPdf(docDefinition).download(`ตอนที่ ${data.index} ${data.title}.pdf`)
  // pdfMake.createPdf(docDefinition).open()
}
function toDataURL(url, callback){
  var xhr = new XMLHttpRequest();
  xhr.open('get', url);
  xhr.responseType = 'blob';
  xhr.onload = function(){
    var fr = new FileReader();
  
    fr.onload = function(){
      callback(this.result);
    };
  
    fr.readAsDataURL(xhr.response); // async call
  };
  
  xhr.send();
}
  useEffect(() => {
      
    var div1= document.getElementById(`pdf${data.id}`)
    var list = div1.getElementsByTagName("IMG");
    var listClass = div1.getElementsByClassName("image")
    if(listClass){
    for (let index = 0; index < listClass.length; index++) {
      let myImage = list[index]
      toDataURL(myImage.src, function(dataURL){
        var para = document.createElement("IMG");
        para.setAttribute("id", `imgResutl${index+1}-${data.id}`);
        listClass[index].appendChild(para);
        if(listClass[index].style.width!=''){
          var percents = parseInt(listClass[index].style.width);
          var parentWidth =595 
          var pixels = parentWidth*(percents/100);
        }
        let result = document.getElementById(`imgResutl${index+1}-${data.id}`)
       if (result) {
        result.src = dataURL;
        result.style.margin = '1em auto'
        result.style.margin = '0 auto'
        result.style.maxWidth ='100%';
        result.style.minWidth = '50px'
        if(listClass[index].style.width!='') result.style.width = `${pixels}px`
        else result.style.width = `630px`
        var canvas = document.createElement('canvas');
        canvas.width = myImage.naturalWidth;
        canvas.height = myImage.naturalHeight;
        canvas.getContext('2d').drawImage(myImage, 0,0);
      } 
        myImage.remove();
        var listClassFlor = div1.getElementsByClassName("image-style-align-left")
   
        if(listClassFlor.length){
            for (let index3 = 0; index3 < listClassFlor.length; index3++) {
              listClassFlor[index3].getElementsByTagName("IMG")[0].setAttribute('class','images')
            }
        
        }
        var listClassFlorR = div1.getElementsByClassName("image-style-align-right")
        if(listClassFlorR.length){
            for (let index3 = 0; index3 < listClassFlorR.length; index3++) {
              listClassFlorR[index3].getElementsByTagName("IMG")[0].setAttribute('class','imagesR')
            }
        }
      })
    }
   
  }
    var imgl = document.getElementById(`imglogo${data.id}`);
    if(imgl){
      toDataURL(imgl.src, function(dataURL){
      setimgLogo(dataURL)
      imgl.remove()
      })
    }
    
    const tmp =  document.querySelectorAll( 'oembed[url]' )
  
    document.querySelectorAll('figure[class="media"]').forEach( (element,index) => {
      if (tmp[index]) {
        let l = tmp[index].getAttribute('url')
        element.innerHTML=`<a style="color:gray;text-align: center;" href="${l}" >${l}<a/>`;
      }
      
    });
    let arH = [
      {name:'P'},
      {name:'H1'},
      {name:'H2'},
      {name:'H3'},
      {name:'H4'},
      {name:'H5'},
      {name:'SPAN'}
    ]
    for (let indexx = 0; indexx < arH.length; indexx++) {
      var spann = div1.getElementsByTagName(arH[indexx].name);
      if(spann){
        for (let index3 = 0; index3 < spann.length; index3++) {
          for (let index2 = 0; index2 < spann[index3].innerHTML.length; index2++) {
            if (spann[index3].innerHTML.charCodeAt(index2) > 10000) {
                spann[index3].innerHTML = spann[index3].innerHTML.replace(spann[index3].innerHTML[index2], " ") 
              }
          }
        
        }
      }
      
    }
    


  
  }, [])


  return (
    <div>
        <div className="d-none" id={`pdft${data.id}`}>
           
                <img id={`imglogo${data.id}`}  src='/images/logo.jpg'/>

              {/*  <div className="d-flex"  >
              <div id={`logo`}> 
                 <img id={`imglogor${data.id}`} />
              </div>
              
              {`ตอนที่ ${data.index} ${data.title}`}</div> */}
              {/* <hr/> */}
              {/* <div className="headpdf" style={{  backgroundColor:'#FBF4E1'}}>
                 ตอนที่ : {data.index} {data.title}
              </div> */}
          <div id={`pdf${data.id}`} dangerouslySetInnerHTML={{__html: data.content}} />
        </div>
          
      {status == 0 ? (
        <img src="/icon/blog-icon-download-g.svg" />
      ) : (
        <img onClick={()=>{printPDF()}}
          className="blog-btn-download-pdf"
          src="/icon/blog-icon-download.svg"
        />
      )}
      
            
        
    </div>
  );
}
