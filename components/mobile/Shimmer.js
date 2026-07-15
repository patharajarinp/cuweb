const  Shimmer = (props) =>{

  //console.log(props.size);
  const default_size = [100,50]
  const size = props.size || default_size
  const dimemsion_style = {width:`${size[0]}px` ,height:`${size[1]}px` }
  return <div className="shimmer" style={dimemsion_style} />
}

const CircularShimmer = (props) =>{
  const default_size = 100
  const size = props.size || default_size
  const dimemsion_style = {width:`${size}px` ,height:`${size}px` }
  return <div className="shimmer circular" style={dimemsion_style} >
      
  </div>
}

export default Shimmer