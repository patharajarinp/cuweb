import { BeatLoader } from "react-spinners";


const Loadbutton = (props) => {
  const {loading, _click, _name, _class, _type,disabled,name,value} = props;

  return (
    <>
      <button type={_type} className={_class} disabled={disabled || loading} name={name} value={value} onClick={_click}>
        {
          loading ? (
            <BeatLoader size={10} color={"#FFF"} loading={loading} />
          ) : (
            _name
          )
        }
      </button>
    </>
  )
}
export default Loadbutton