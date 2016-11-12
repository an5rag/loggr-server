function auth(user, res){
    if(!user) {
        return res.status(401).json({
            success: false,
            error: 'loginError'
        });
        return false;
    } else {
        return false;
    }
}

module.exports = auth;