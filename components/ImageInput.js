import {useState,useEffect} from 'react'

export default  (props) =>{
  const {name = "", className = ""} = props;
  const [src,setSrc] = useState(props.picture)
  const id = 'img-upload-'+new Date().getTime()

  useEffect(()=>{
    setSrc(props.picture)
  },[props.picture])

  const _onChange = (e)=>{
    var file = e.target.files[0];
    if(!file) return;
    var url = URL.createObjectURL(file)
    setSrc(url);
  }

  // console.log('props.picture',props.picture)
  return (
    <>
    <div className="box-edit-profile">
      <div>
        <img src={src} className="img-profile" />
      </div>
      <div className="">
        <label className="img-edit-profile" htmlFor={id}>
          <img src={`/icon/photo.svg`} />
        </label>
        <input type="file" 
        style={{width:'0',height:'0',position:'absolute',top:'0',left:'0',opacity:'0' }}
        id={id} 
        name={name}
        onChange={_onChange}
        accept="image/*"/>
      </div>
    </div>
    </>
  )
}