import React from 'react';
import classnames from "classnames";
import { Link, withTranslation } from '../../utils/i18n';

const BreadcrumbMB = ({item,className}) => {
  return <div className={classnames("breadcrum-cont",className)}>
    {item?.map((v,i) => (
      v.href ? 
      <Link href={v.href} as={v.as}>
        <a className={classnames("breadcrum-item",{"breadcrum-active":v.active})}>
          
            {v.text}
        </a>
      </Link> 
      :
      <span className={classnames("breadcrum-item",{"breadcrum-active":v.active})}>
        {v.text}
      </span>
    )
      
    )}
    {/* <Link href={`/blog/writer/[idwriter]?idwriter=${val.id}`} as={`/blog/writer/${val.id}`}>
      <a>

      </a>
    </Link> */}
    {/* <span className="breadcrum-item">
      svdfsdf
    </span>
    <span className="breadcrum-item">
      svdfsdf
    </span>
    <span className="breadcrum-item breadcrum-active">
      svdfsdf
    </span> */}
      
  </div>;
};

export default BreadcrumbMB;
