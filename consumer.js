import { connect as _connect } from 'amqplib';
import fetch from 'node-fetch';

const rabbitSettings = {
  protocol: 'amqp',
  hostname: '34.231.183.98',
  port: 5672,
  username: 'alejandro',
  password: '8084'
};

async function connect() {
  const queue = 'InitialEvent';
  try {
    const conn = await _connect(rabbitSettings);
    console.log('Conexión exitosa');
    const channel = await conn.createChannel();
    console.log('Canal creado exitosamente');

    channel.consume(queue, async (msn) => {
      const messageContent = msn.content.toString();
      console.log(messageContent);
      try {
        const response = await fetch('http://34.232.147.52:3003/products/', {
          method: 'POST', 
          body: messageContent,
          headers: { 'Content-Type': 'application/json' }
        });

        if (response.ok) {
          console.log('Mensaje enviado a la API');
        } else {
          console.error('Error al enviar mensaje');
        }
      } catch (error) {
        console.error('Error al llamar la API', error);
      }
      channel.ack(msn);
    });

  } catch (error) {
    console.error('Error:', error);
  }
}

connect();