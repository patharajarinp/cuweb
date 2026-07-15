
import useMediaQuery from '../../hooks/useMediaQuery';
import MobileDetail from '../mobile/news/MobileDetail';
import Detail from './Detail';

const MainDetail = (props) => {
  const {page, data, books, query} = props;
  
  const isMobile = useMediaQuery(992);
  
  return (
    <>
      {
        !isMobile ? (
          <Detail page_key={page} data={data} books={books} query={query} />
        ) : (
          <MobileDetail page_key={page} data={data} books={books} query={query} />
        )
      }
    </>
  )
}
export default MainDetail