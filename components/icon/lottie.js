import heart from '../../public/json/heart.json'
import effect from '../../public/json/effect.json'



const HeartLottie = ({style}) =>{
	return (
		<lottie-player
	    src={JSON.stringify(heart)}  background="transparent" speed="2"  style={style} autoplay>
		</lottie-player>
	)
} 

const EffectLottie = ({style}) =>{
	return (
		<lottie-player
	    src={JSON.stringify(effect)}  background="transparent" speed="2"  style={style} autoplay>
		</lottie-player>
	)
} 

export {
	HeartLottie,
	EffectLottie
}