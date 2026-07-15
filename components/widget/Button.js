import { BeatLoader } from "react-spinners";


const Loadbutton = (props) => {
  const {type = "button", classNmae = "w-100", disabled} = props;
  return (
    <>
    <button type={type} className={`btn btn-primary ${classNmae}`} disabled={props.loading || disabled} onClick={props.click}>{props.loading ? <BeatLoader size={10} color={"#FFF"} loading={props.loading} /> :props.name}</button>
    </>
  )
}
export default Loadbutton