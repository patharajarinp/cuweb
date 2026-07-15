import 'lazysizes';
import App from 'next/app';
import React from 'react';
import dynamic from 'next/dynamic';
import socketIOClient from 'socket.io-client';
import LoadingBar from '../components/LoadingBar';
import Cookies from '../components/widget/cookies';
import { UserProvider } from '../contexts/UserContext';
import '../public/css/font.css';
import '../public/css/n8n/n8n.css';
import '../public/css/n8n/mobile_n8n.css';
import api from '../utils/api';
import AuthService from '../utils/AuthService';
import { appWithTranslation, i18n, Router, useTranslation, withTranslation } from '../utils/i18n';
import { GlobalDebug } from '../utils/debug';

const MobileChatAI = dynamic(() => import('../components/mobile/mobile_n8n/mobile_chat_ai'), { ssr: false });

const BASE_LOCAL = 'https://te-api.chulabook.com'
const BASE = process.env.NEXT_PUBLIC_API_URL || process.env.api_url || process.env.API_URL || BASE_LOCAL;

class MyApp extends App {
  state = {
    profile: null,
    endpoint: BASE,
    message: [],
    test: false,
    handle: [],
  };

  // เพิ่ม handler สำหรับจับ Chunk load error
  handleChunkError = (event) => {
    const msg = (event && (event.message || (event.error && event.error.message))) || '';
    if (msg.includes('ChunkLoadError') || msg.includes('Loading chunk')) {
      const key = 'chunk-reload-attempted';
      const hasReloaded = sessionStorage.getItem(key);
      if (!hasReloaded) {
        // ทำเครื่องหมายแล้วรีโหลดครั้งหนึ่งเพื่อดึง build/asset ใหม่
        sessionStorage.setItem(key, String(Date.now()));
        console.warn('ChunkLoadError detected → reloading to fetch latest build/assets');
        window.location.reload();
      } else {
        // ถ้ารีโหลดแล้วแต่ยัง error ให้แจ้งผู้ใช้ (ป้องกัน reload loop)
        if (!sessionStorage.getItem(key + '-alerted')) {
          sessionStorage.setItem(key + '-alerted', '1');
          alert('เกิดข้อผิดพลาดในการโหลดส่วนของหน้า กรุณาลองล้างแคชหรือลองเปิดใหม่อีกครั้ง');
        }
      }
    }
  }

  handleChunkRejection = (event) => {
    const reason = event && event.reason;
    const msg = (reason && (reason.message || String(reason))) || '';
    if (msg.includes('ChunkLoadError') || msg.includes('Loading chunk')) {
      this.handleChunkError({ message: msg });
    }
  }

  fetchUser = () => {
    api.getProfile().then(res => {
      const data = res.data;
      this.setState({ user: data })
      if (!this.state.socket) {
        const socket = socketIOClient(this.state.endpoint);
        this.setState({ socket });
      }
    })
      .catch(err => {
        console.log(err)
        if (err.response) {
          if (err.response.status == 404) {
            AuthService.logout()
            location.reload();
          }
          console.log(err.response.status);
        }
      })
  }

  setHandle = (_handle) => {
    let tmp = { ...this.state.handle };
    tmp[_handle.key] = _handle.fn;
    this.setState({ handle: tmp });
  }

  setUser = (data) => {
    this.setState({ user: data, test: !this.state.test })
  }

  componentWillUnmount() {
    if (this.state.socket)
      this.state.socket.disconnect()

    // เอา listener ออกเมื่อ component ถูกถอด
    window.removeEventListener('error', this.handleChunkError);
    window.removeEventListener('unhandledrejection', this.handleChunkRejection);
  }

  componentDidMount() {
    if (process.env.ENABLE_CONSOLE == 0) GlobalDebug(false);

    AuthService.validateVersion();

    // เริ่มต้นภาษาโดยดูจาก path และ localStorage (ถ้ามี) และตั้งค่า i18n ให้ตรงกัน เพื่อให้แน่ใจว่าไม่มีปัญหาเรื่องการเลือกภาษาผิดพลาด
    // ลำดับการตรวจสอบและตั้งค่าภาษา:
    // 1. ตรวจสอบ path ว่าเป็น /en หรือเริ่มต้นด้วย /en/ หรือไม่ ถ้าใช่ให้เลือก 'en'
    // 2. ถ้าไม่ใช่ให้เลือก 'th' เป็นค่าเริ่มต้น
    // 3. ตั้งค่า i18n ให้ตรงกับภาษาที่เลือก
    // 4. เก็บภาษาที่เลือกลง localStorage เพื่อให้จำได้ในการเข้าครั้งถัดไป
    const path = (typeof window !== 'undefined' && window.location && window.location.pathname) ? window.location.pathname : '';
    const storageLang = (typeof window !== 'undefined' && window.localStorage) ? window.localStorage.i18nextLng : undefined;
    const initialLang = (path === '/en' || path.indexOf('/en/') === 0) ? 'en' : 'th';

    console.log('[i18n:init] before', {
      path,
      i18nLanguage: i18n.language,
      storageLang,
      selectedInitialLang: initialLang,
    });

    this.setState({ local: initialLang });
    if (i18n.language !== initialLang) {
      i18n.changeLanguage(initialLang);
    }
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.i18nextLng = initialLang;
    }
    console.log('[i18n:init] after', {
      stateLocal: initialLang,
      i18nLanguage: i18n.language,
      storageLang: (typeof window !== 'undefined' && window.localStorage) ? window.localStorage.i18nextLng : undefined,
    });
    // --
    if (AuthService.isLoggin()) {
      this.fetchUser();
    }
    else {
      const regex = /user/
      const regex2 = /forgot-password|change-password/
      if (regex.test(Router.pathname) && !regex2.test(Router.pathname)) {
        window.location = '/login'
      }
    }

    // เพิ่ม listener สำหรับจับ ChunkLoadError
    window.addEventListener('error', this.handleChunkError);
    window.addEventListener('unhandledrejection', this.handleChunkRejection);
  }

  response = () => {
    const socket = socketIOClient(endpoint)
    this.setState({ socket })
  }

  response = () => {
    const socket = socketIOClient(endpoint)
    this.setState({socket})
  }

  onSocket = (topic,eventSocket,type) =>{
    const { endpoint } = this.state
    this.state.socket && this.state.socket.on(topic, (res) => {
      if(!type || type == res.type)
        eventSocket(res,res.code)
    })
  }

  send = (topic, message) => {
    if (this.state.socket) {
      this.state.socket.emit(topic, message);
    }
  }

  handleCart = ({ cart, amount }) => {
    if (amount == 0) return;
    api.updateNumcard(cart.id, { quantity: amount })
      .then(res => {
        let tmp = { ...this.state.user };
        let cart_tmp = [...tmp.cart]
        cart_tmp.find((c) => c.id == cart.id).quantity = parseInt(amount);
        tmp.cart = cart_tmp
        this.setState({ user: tmp })
      })
      .catch(err => {
        console.log(err);
        if (err.response.data.code == 1211) {
          alert('สินค้าไม่เพียงพอ');
        }
      })
  }

  setLocal = (local) => {
    this.setState({ local })
  }

  render() {
    const { Component, pageProps } = this.props
    const user = this.state.user;

    if (process.env.ENABLE_CONSOLE == 0) GlobalDebug(false);

    return (
      <UserProvider value={{ user, handleCart: this.handleCart, test: this.state.test, fetchUser: this.fetchUser, useTranslation, Link: this.LocalLink, i18n, withTranslation, Router, onSocket: this.onSocket, setUser: this.setUser, local: this.state.local, setLocal: this.setLocal }}>
        <LoadingBar />
        <Component {...pageProps} user={this.state.user} />
        <MobileChatAI />
        <Cookies />
      </UserProvider>
    );
  }
}

export default appWithTranslation(MyApp)