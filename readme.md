# eSewa Payment Integration

This repository demonstrates how to integrate eSewa payment gateway into your Node.js application using Express. It includes functionality for generating a secure signature for payment transactions and submitting a payment form to the eSewa API.

---

## Features

- Generate secure HMAC-SHA256 signatures for eSewa transactions.
- Create and submit dynamic payment forms to the eSewa gateway.
- Handle payment success and failure callbacks.

---

## Installation

### Prerequisites

- [Node.js](https://nodejs.org) (version 14 or later recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Steps

1. Clone the repository:

```bash
git clone https://github.com/Sushank-ghimire/esewa-payment-integration.git
```

2. Navigate to the project directory:

```bash
cd esewa-payment-integration
```

3. Install dependencies:

```bash
npm install
```

4. Start the server:

```bash
npm start
```

The application will run on `http://localhost:3000` by default.

---

## Code Details

### `generateRandomString` Function

Generates a random 25-character string to be used as the `transaction_uuid` for unique transaction identification.

```javascript
function generateRandomString() {
  const strings =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let code = "";
  let length = 25;
  for (let i = 0; i < length; i++) {
    code += strings[Math.floor(Math.random() * strings.length)];
  }
  return code;
}
```

### `generateSignature` Function

Generates an HMAC-SHA256 signature for secure transaction data.

```javascript
function generateSignature(message, secret) {
  const hash = crypto.HmacSHA256(message, secret);
  const hashInBase64 = crypto.enc.Base64.stringify(hash);
  return hashInBase64;
}
```

### Payment Form Endpoint (`/pay-with-esewa`)

Renders a dynamic payment form with pre-filled values and the generated signature.

```javascript
app.get("/pay-with-esewa", (req, res, next) => {
  let order_price = req.query.price;
  let tax_amount = 0;
  let amount = order_price;
  let transaction_uuid = generateRandomString();
  let product_code = "EPAYTEST";
  let product_service_charge = 0;
  let product_delivery_charge = 0;
  let secretKey = "8gBm/:&EnhH.1/q";
  let signature = generateSignature(
    `total_amount=${amount},transaction_uuid=${transaction_uuid},product_code=${product_code}`,
    secretKey
  );

  res.send(`
    <body>
        <form style="display: flex; flex-direction: column; gap: 15px;" action="https://rc-epay.esewa.com.np/api/epay/main/v2/form" method="POST">
            <input type="text" id="amount" name="amount" value="${amount}" required>
            <input type="text" id="tax_amount" name="tax_amount" value ="${tax_amount}" required>
            <input type="text" id="total_amount" name="total_amount" value="${amount}" required>
            <input type="text" id="transaction_uuid" name="transaction_uuid" value="${transaction_uuid}" required>
            <input type="text" id="product_code" name="product_code" value ="EPAYTEST" required>
            <input type="text" id="product_service_charge" name="product_service_charge" value="${product_service_charge}" required>
            <input type="text" id="product_delivery_charge" name="product_delivery_charge" value="${product_delivery_charge}" required>
            <input type="text" id="success_url" name="success_url" value="http://localhost:3000/success" required>
            <input type="text" id="failure_url" name="failure_url" value="http://localhost:3000/failure" required>
            <input type="text" id="signed_field_names" name="signed_field_names" value="total_amount,transaction_uuid,product_code" required>
            <input type="text" id="signature" name="signature" value="${signature}" required>
            <input value="Submit" type="submit">
         </form>
    </body>
    `);
});
```

### Payment Callbacks

#### Success Callback (`/success`)

Handles successful payment responses.

```javascript
app.get("/success", (req, res) => {
  return res
    .status(201)
    .json({ message: "Payment successful.", success: true });
});
```

#### Failure Callback (`/failure`)

Handles failed payment responses.

```javascript
app.get("/failure", (req, res) => {
  return res.status(400).json({ message: "Payment failed.", success: false });
});
```

---

## Usage

1. Navigate to `http://localhost:3000/pay-with-esewa?price=<amount>`.
2. Replace `<amount>` with the total price for the transaction.
3. The app dynamically generates a payment form with a secure signature.
4. Submit the form to proceed with the payment via eSewa.

---

## Important Notes

- Replace `success_url` and `failure_url` in the payment form with your production URLs for proper payment callbacks.
- Use a secure, secret key (`secretKey`) in your environment for generating signatures.
- Ensure that the `product_code` aligns with your eSewa account configuration.

---

## License

This project is open-source and available under the MIT License.
