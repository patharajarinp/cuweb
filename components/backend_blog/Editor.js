import {useState, useEffect} from 'react'
import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from 'ckeditor';
import api from '../../utils/api'

const Editor = (props) =>{
  
  const config = {
    toolbar: [  
      'heading',
      'bold',
      'italic',
      'underline',
      'fontColor',
      'fontSize',
      'alignment',

      'highlight',
      'link',
      'mediaEmbed',
      'bulletedList',
      'numberedList', 
    
      'indent',
      'outdent',
  
      'imageUpload',
      'blockQuote',
      'specialCharacters',
      'insertTable',
  
      'undo',
      'redo'
    ],
    removePlugins: [ 'ImageCaption' ],
    image: {
      toolbar: [ 'imageTextAlternative', '|', 
      // 'imageStyle:alignLeft',
       'imageStyle:full', 
      //  'imageStyle:alignRight' 
      ],
      styles: [
        'full',
        // 'alignLeft',
        // 'alignRight'
      ]
    },
    heading: {
      options: [
        { model: 'paragraph', title: 'Paragraph', class: 'ck-heading_paragraph' },
        { model: 'heading1', view: 'h1', title: 'Heading 1', class: 'ck-heading_heading1' },
        { model: 'heading2', view: 'h2', title: 'Heading 2', class: 'ck-heading_heading2' },
        { model: 'heading3', view: 'h3', title: 'Heading 3', class: 'ck-heading_heading3' },
        { model: 'heading4', view: 'h4', title: 'Heading 4', class: 'ck-heading_heading4' },
        { model: 'heading5', view: 'h5', title: 'Heading 5', class: 'ck-heading_heading5' }
    ]
    },
    fontSize: {
      options: [
        8,10,12,14,'default',18,20,22,24,26,28,30,32,34,36,38,40
      ]
    },
    simpleUpload: {
      uploadUrl: api.baseUrl + '/ck-upload/images',
      // headers: {
      //     'X-CSRF-TOKEN': 'CSFR-Token',
      //     Authorization: 'Bearer <JSON Web Token>'
      // }
    },
    
  }

  const {height = '200px',data='',name,required,onAction,onClear,setNewImg,newImg,_placeholder} = props;
  // const [data, setData] = useState('')
  const [inputData,setInputData] = useState('')
  const [inputCheck,setInputCheck] = useState('')
  const [inputDefale,setInputDefale] = useState()
 
  useEffect(()=>{
    setInputData(data)
    setInputCheck(data)
   setInputDefale(data)
  },[data])
  const onEditorChange =(event, editor )=>{
    
    const data = editor.getData();
   
   
    setInputData(data)
    if (onAction)
      onAction(data);
  }
  useEffect(()=>{
    console.log('onClear', onClear,newImg)
    if(onClear && newImg ){
      delimg(newImg)
    }
  },[onClear,newImg])
  useEffect(()=>{
    var div1= document.getElementById(`content`)
    var list = div1.getElementsByTagName("IMG");
    let img1 = []
    for (const item of list) {
     if(item.src) img1.push(item.src)
    }
    // console.log('img1', img1)
    var div2= document.getElementById(`content-defale`)
    var list2 = div2.getElementsByTagName("IMG");
    let img2 = []
    for (const item2 of list2) {
      if(item2.src) img2.push(item2.src)
    }
    // console.log('img2', img2)
    // var div3= document.getElementById(`content-check`)
    // var list3 = div3.getElementsByTagName("IMG");
    // let img3 = []
    // for (const item3 of list3) {
    //   if(item3.src) img3.push(item3.src)
    // }
    // console.log('img3', img3)
    setInputDefale(data)
    checkImg(img1,img2)
    setInputCheck(inputData)
  },[inputData])

  const checkImg = (img1,img2)=>{
    let task = []
    if (img1.length) {
      for (let index = 0; index < img2.length; index++) {
        const chImg = img1.findIndex((val)=>val == img2[index])
        if(chImg != -1) img1.splice(chImg, 1)
        // console.log('chImg', chImg)
        // if(chImg.length) task.push([...chImg])
      }
      if (newImg&&newImg.length) {
        for (let index3 = 0; index3 < img1.length; index3++) {
          const chImg2 = newImg.findIndex((val)=>val == img1[index3])
          if(chImg2 != -1) newImg.splice(chImg2, 1)
        }
        // console.log('delImg', newImg)
        if(newImg.length) delimg(newImg)
        setNewImg(img1) 
      }else if(img1.length){
        setNewImg(img1) 
      }
    }  
  }
  const delimg = (data)=>{
    api.blogImage({imageFile:data}).then(async (res) => {
      //  alert('ลบรูปสำเร็จ')
      })
      .catch((err) => {
        console.log(err.response);
      });
  }

  return (
    <div style={{position:'relative'}}>
      <textarea name={name} 
      defaultValue={inputData}
      required={required}
      style={{width:'100%',height:'100%',position:'absolute',opacity:0}} placeholder={_placeholder?_placeholder:''}>
          
      </textarea>
      <CKEditor
        editor = {ClassicEditor}
        config = {{...config ,  placeholder: _placeholder?_placeholder:''}}
        data = {data}
        onInit = { 
          editor => {
            console.log(ClassicEditor.builtinPlugins.map( plugin => plugin.pluginName ));
            editor.editing.view.change( writer => {
              writer.setStyle( 'min-height', height, editor.editing.view.document.getRoot() );
            });
          } 
        }
        onChange={onEditorChange}
      />
      <div id={`content-defale`} className="d-none" dangerouslySetInnerHTML={{__html: inputDefale}} />
      <div id={`content`} className="d-none" dangerouslySetInnerHTML={{__html: inputData}} />
      <div id={`content-check`} className="d-none" dangerouslySetInnerHTML={{__html: inputCheck}} />
    </div>
  )
}

export default Editor