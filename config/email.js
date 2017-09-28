module.exports.email = {
    // auth: {user: 'renanpontez@gmail.com', pass: 'carnaval2009'},
    transporter: {
        host: 'us2.smtp.mailhostbox.com',
        port: 587,
        secure: false, // use SSL
        auth: {
            user: 'sac@pineapple.com.br',
            pass: '32440339pa'
        }
  },
    from: 'sac@pineapple.com.br',
    testMode: false,
};
