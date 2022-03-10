class HelperValidators {

    //Email validator
    async isEmail(email) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email)
    }

    // BD phone number validator
    async isPhone(phone) {
        const regex = /^(?:\+88|88)?(01[3-9]\d{8})$/i
        return regex.test(phone)
    }

    // Empty value check
    async isEmpty(data) {
        return (data == null || data === '' || data.length === 0)
    }
}

module.exports = new HelperValidators();