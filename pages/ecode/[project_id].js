import React, { useContext, useEffect, useState } from 'react';
import api from '../../utils/api';
import { Link, withTranslation } from "../../utils/i18n";
import UserContext from '../../contexts/UserContext';
import { useRouter } from 'next/router';
import useMediaQuery from '../../hooks/useMediaQuery';
import Custom404 from './404'
import Loading from '../../components/loading'
import LayoutEcode from '../../components/ecode/LayoutEcode';
import EcodeMainDesktop from '../../components/ecode/EcodeMainDesktop';
import EcodeMainMobile from '../../components/ecode/EcodeMainMobile';
const ProjectEcode = (props) => {
	const router = useRouter();
	const project_id = router.query.project_id;
	const { t } = props;
	const [project, setProject] = useState();
	const [book, setBook] = useState();
	const [bookimg, setBookimg] = useState();
	const [loading, setLoading] = useState(true);
	const [product, setProduct] = useState();
	const [img, setImg] = useState(`${api.frontend_url}/images/book.png`);
	const [clickImg, setClickImg] = useState(false);
	const [show, setShow] = useState(false);

	const { user, onSocket, setUser, local, setLocal } = useContext(UserContext)

	const IsMember = () => {
		return user && user.member && user.member.STATUS == "Y";
	}
	const logout = () => {
		AuthService.logout();
		// setUser(null);
		// Router.push('/');
		window.location.href = '/';
	}
	const fetchdataProject = async () => {
		setLoading(true);
		await api.getOneEcodeProject(project_id).then(res => {
			const data = res.data;
			setLoading(false);
			if (data) {
				setProject(data);
			} else {
				window.location.href = '/ecode/404';
			}

		})
			.catch(err => {
				window.location.href = '/ecode/404';
				console.log(err.response);
			})
	};
	const fetchdataDetail = (book_id) => {
		let params = {
			is_onlyECode: 1,
		}
		api.getOneDataDetail(book_id, params).then(res => {
			const data = res.data;
			setProduct(data);
			setShow(true);
		})
			.catch(err => {
				console.log(err.response);
			})

	};
	const fetchdataBook = (params) => {
		params = project_id;
		api.getBooklistEcode(params).then(res => {
			const data = res.data;
			setBook(data);
		})
			.catch(err => {
				console.log(err.response);
			})
	};
	setTimeout(() => {
		setLoading(false);
	}, 1000);

	const settings = {
		dots: false,
		infinite: false,
		speed: 500,
		slidesToShow: 4,
		slidesToScroll: 1,
		responsive: [
			{
				breakpoint: 1200,
				settings: {
					slidesToShow: 3,
					slidesToScroll: 1,
					infinite: false,
					dots: false
				}
			},
			{
				breakpoint: 768,
				settings: {
					slidesToShow: 3,
					slidesToScroll: 1,
					infinite: false,
					dots: false
				}
			}
		]
	};

	const [fileType, setFileType] = useState('image');
	const [mimeType, setMimeType] = useState();
	const handleImg = (pic, type, mimetype) => {
		// console.log('pic',pic);
		// console.log('type',type);
		// console.log('mimetype',mimetype);
		setImg(pic);
		setFileType(type);
		setMimeType(mimetype);
		setClickImg(true)
	}

	useEffect(() => {
		fetchdataBook();
		fetchdataProject();
	}, [project_id]);

	useEffect(() => {
		setBookimg(props.product_img);
	}, []);

	const isMobile = useMediaQuery(992);


	var linkPath = project?.url_project;


	return (
		<>
			{loading && <Loading />}

			{project ?
				(
					<LayoutEcode linkPath={linkPath} title={`Ecode | ${project ? project?.project_name : ''}`} description={`รหัสวิชา : ${project?.subject_id} | หลักสูตร : ${project?.course} | อาจารย์ผู้สอน : ${project?.teacher} `}>
						{
							isMobile ? <EcodeMainMobile product={product} project={project} book={book} show={show} fetchdataDetail={fetchdataDetail} setShow={setShow} user={user} /> :


								<EcodeMainDesktop product={product} project={project} book={book} show={show} fetchdataDetail={fetchdataDetail} setShow={setShow} user={user} />

						}
					</LayoutEcode>
				) : ''}

		</>
	)
}




export default withTranslation('product_detail')(ProjectEcode)