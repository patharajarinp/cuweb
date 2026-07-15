import classnames from "classnames";
import { BeatLoader } from "react-spinners";

const Loadbutton = (props) => {
  const {btntype, loading, name, _class} = props;
  return (
    <>
    <button type={btntype == 'submit' ? 'submit' : 'button'} className={classnames("btn btn-primary w-100 my-3 h-40px", _class)} disabled={loading} >{loading ? <BeatLoader size={10} color={"#FFF"} loading={loading} /> : name}</button>
    </>
  )
}
export default Loadbutton