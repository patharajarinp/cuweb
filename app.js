const express = require('express')
const next = require('next')
const app = next({ dev: process.env.NODE_ENV !== 'production' })
const handle = app.getRequestHandler()
const getConfig = require('next/config')
const { serverRuntimeConfig } = getConfig.default()
const { parse } = require('url');
const cors = require('cors');
// const sha256 = require('js-sha256')
// var rp = require('request-promise');
// var bodyParser = require('body-parser');
// var FormData = require('form-data');
// var convert = require('xml-js');
var mobile = require('is-mobile');
const { default: NextI18Next } = require('next-i18next')
// const { base64encode, base64decode } = require('nodejs-base64');
const port = parseInt(process.env.PORT, 10) || 3000;

// console.log(getConfig.default())

// console.log('show blog : ',serverRuntimeConfig.show_blog)


app.prepare().then(() => {
    const server = express()

    server.use(cors('*'));
    server.get(/\.asp$/, (req, res, next) => {
        //console.log('testttddd')
        res.redirect('/')
    })

    server.get('/en/th/*', (req, res) => {
        const parsedUrl = parse(req.url, true);
        parsedUrl.pathname = parsedUrl.pathname.replace(/^\/en\/th/, '/en');
        const newUrl = parsedUrl.pathname + (parsedUrl.search || '');
        return res.redirect(301, newUrl);
    });

    server.get('/th/*', (req, res) => {
        const parsedUrl = parse(req.url, true);
        parsedUrl.pathname = parsedUrl.pathname.replace('/th/', '/');
        const newUrl = parsedUrl.pathname + (parsedUrl.search || '');
        return res.redirect(301, newUrl);
    });

    server.get(/[th|en]*\/blog\/*/, (req, res, next) => {
        // console.log('testttddd',req.pathname)
        if (serverRuntimeConfig.show_blog != 1) {
            return res.status(404).end()
        }
        next();

        // res.redirect('/')
    })

    server.get('*', function (req, res, next) {
        const ua = req.header('user-agent');
        const isMobile = mobile({ ua });
        // console.log(req.originalUrl.search('writer/manage'))
        // console.log(req.path)

        if (req.path.search('writer/manage') != -1) return next();

        // กรณีที่เป็น mobile และ path ไม่ใช่ writer/manage ให้ redirect ไปยัง mobile site
        /** 
         * ? เมื่อเปิดส่วนนี้ จะทำให้เวลา รัน ฝั่งโบบายจะแสดงหน้า mobile แต่ถ้า รัน ฝั่ง desktop จะแสดงหน้า desktop ตามปกติ ใน เว็บจริง โดยจะไปรัน https://m.chulabook.com ซึ่งจะเป็น หน้าเว็บจริง 
         * ! อย่าไปยุ่งกับส่วนนี้ ถ้าไม่แน่ใจ เพราะอาจจะทำให้การแสดงผลผิดพลาดได้ โดยเฉพาะถ้า รัน ฝั่ง desktop แล้วไปแสดงหน้า mobile ซึ่งจะทำให้การแสดงผลผิดพลาด และอาจจะทำให้เกิดปัญหาในการใช้งานได้
         * ! การทำงานของส่วนนี้คือ จะตรวจสอบว่า user-agent เป็น mobile หรือไม่ ถ้าเป็น mobile จะทำการ redirect ไปยัง mobile site โดยจะเอา path เดิมมาแปลงเป็น path ของ mobile site โดยจะตัด subdomain th หรือ en ออกไป
         * ! และนำ path ที่เหลือมาแปลงเป็น path ของ mobile site แล้วทำการ redirect ไปยัง mobile site โดยใช้ status code 301 ซึ่งเป็น status code สำหรับ permanent redirect
         **/ 
        // if(isMobile ){
        //     let originalUrl = req.originalUrl;
        //     const [,sub,...rest] = originalUrl.split('/')
        //     if(sub =='th' || sub == 'en')
        //         originalUrl = '/'+rest.join('/')
        //     var mobile_url = process.env.NODE_ENV ? serverRuntimeConfig.mobile_url || 'https://m.chulabook.com' : 'http://localhost:3000'
        //     return res.redirect(mobile_url+originalUrl)
        // }

        // console.log('desk')
        return next();
    })
    // server.use(NextI18NextMiddleware(NextI18Next))
    
    server.all('*', (req, res) => {
        return handle(req, res)
    })

    server.listen(port, err => {
        if (err) throw err
        console.log(`> Ready on http://localhost:${port} `)
    })
})