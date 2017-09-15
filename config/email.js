module.exports.email = {
    service: 'Gmail',
    // auth: {user: 'renanpontez@gmail.com', pass: 'carnaval2009'},
    transporter: {
        host: 'smtp.gmail.com',
        port: 465,
        secure: true, // use SSL
        auth: {
            user: 'renanpontez@gmail.com',
            pass: 'carnaval2009'
        }
  },

    from: 'renanpontez@gmail.com',
    testMode: false,
};
