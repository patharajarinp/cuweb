import React, { useState,useEffect,useContext,useRef } from 'react'
import Router from 'next/router'
import {Modal} from 'react-bootstrap';
import Button from './Button'
import Cropper from 'react-easy-crop'
import { getOrientation } from 'get-orientation/browser'
import { getCroppedImg, getRotatedImage } from '../../../utils/canvasUtils'

const ModalImage = ({show, onHide, size,onSubmit,_img,onAction}) => {
 
    const [preview, setPreview] = useState("/images/no-picture.png");
    const [imageSrc, setImageSrc] = useState(null)
    const [crop, setcrop] = useState({ x: 0, y: 0 })
    const [zoom, setzoom] = useState(1)
    const [aspect, setaspect] = useState(3 / 3)
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)
    const [croppedImage, setCroppedImage] = useState(null)
    const [rotation, setRotation] = useState(0)
    const ORIENTATION_TO_ANGLE = {
        '3': 180,
        '6': 90,
        '8': -90,
    }
    


  useEffect(()=>{
    const img_src = _img || null
    setImageSrc(img_src)
  },[_img])

//   const handleChange = (event) => {
//     if(!event.target.files[0]) {
//       return;
//     }
//     let file = event.target.files[0];
//     setPreview(URL.createObjectURL(file))
//   }

  const submit = async()=>{
    if(!imageSrc ) return alert('No file select')
   await showCroppedImage()
   await onHide()
  }
  
    const onCropChange = crop => {
      setcrop( crop )
      // console.log('crop', crop)
    }
   
    const  onCropComplete = (croppedArea, croppedAreaPixels) => {
      console.log(croppedArea, croppedAreaPixels)
      setCroppedAreaPixels(croppedAreaPixels)
    }
   
    const onZoomChange = zoom => {
      setzoom({ zoom })
    }
    const onFileChange = async e => {
      if (e.target.files && e.target.files.length > 0) {
       const file = e.target.files[0]
        let imageDataUrl = await readFile(file)
  
        // apply rotation if needed
        const orientation = await getOrientation(file)
        const rotation = ORIENTATION_TO_ANGLE[orientation]
        if (rotation) {
          imageDataUrl = await getRotatedImage(imageDataUrl, rotation)
        }
  
        setImageSrc(imageDataUrl)
      }
    }
    const showCroppedImage = async () => {
      
        const croppedImage = await getCroppedImg(
          imageSrc,
          croppedAreaPixels,
          rotation
        )
        // console.log('donee', { croppedImage })
        setCroppedImage(croppedImage)
        var tmp =  await fetch(croppedImage).then(r => r.blob()).then(blobFile => new File([blobFile], "images_profile.jpg", { type: 'image/jpeg' }))
    //   console.log('tmp', tmp)
        if(onSubmit) onSubmit(tmp,croppedImage);
        if(onAction) onAction(true);
    }
  return (
    <Modal className="modal-alert" centered show={show} onHide={onHide} size={size}>
      <Modal.Body>
        <div className="py-5">

          <div className="row justify-content-center">
            <div className="col-6">
              <div className="form-group">
               
                <div className="default-picture">
                  <div>
                    {/* <img src={preview ? preview: ''} className="mw-100 w-auto" /> */}
                    {imageSrc?
                        <div className="crop-container" >
                            <Cropper
                                image={imageSrc}
                                crop={crop}
                                zoom={zoom}
                                aspect={aspect}
                                cropShape="round"
                                showGrid={false}
                                onCropChange={onCropChange}
                                onRotationChange={setRotation}
                                onCropComplete={onCropComplete}
                                onZoomChange={onZoomChange}
                            />
                        </div> 
                    :<img src="/images/no-picture.png" className="mw-100 w-auto" />}
                  </div>
                </div>
              </div>
            </div>
            
          </div>
        <div className="row justify-content-center">
            <div className="col-6">
                <label className="mt-3">ไฟล์</label>
                  <input type="file"  className="form-control" onChange={onFileChange} accept="image/*" />
            </div>
        </div>
          <div className="row justify-content-center mt-4">
            <div className="text-center">
              <Button _type="button" _class="btn-outline-primary" _name="ยกเลิก" _click={onHide} />
              <Button _type="button" _class="btn-primary ml-3" _name="ตกลง" _click={submit} />
            </div>
          </div>
        </div>
      </Modal.Body>
    </Modal>  
  )
}
function readFile(file) {
    return new Promise(resolve => {
      const reader = new FileReader()
      reader.addEventListener('load', () => resolve(reader.result), false)
      reader.readAsDataURL(file)
    })
  }
export default ModalImage
