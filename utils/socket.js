import socketIOClient from 'socket.io-client'

export default class Socket{
  constructor(){
    this.endpoint = process.env.NEXT_PUBLIC_API_URL || process.env.api_url || process.env.API_URL || 'https://api.chulabook.com';
    this.socket = socketIOClient(this.endpoint)
  }

  isConnect = () => {
    return this.socket.connected;
  }

  connect = (token) =>{
    this.socket.emit('sent-token', token)
  }

  send = (token,message) => {
    this.socket.emit('sent-message', token,message)
  }

  // รอรับข้อมูลเมื่อ server มีการ update
  response = () => {
    const temp = [];
    this.socket.on('user connected', (messageNew) => {
      temp.push(messageNew)
    })
  }
}
