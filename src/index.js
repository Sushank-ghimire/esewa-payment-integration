import express from "express";
import crypto from "crypto-js";

const app = express();

app.get("/", (req, res) => {
  res.send("Payment integration");
});

function generateRandomString() {
  const strings = "jdkfjakfjdkjj34kj23i42i4u23i4u23i423u4i";
  let code = "";
  let length = 25;
  for (let i = 0; i < length; i++) {
    code += strings[Math.floor(Math.random() * strings.length)];
  }
  return code;
}

function generateSignature(message, secret) {
  const hash = crypto.HmacSHA256(message, secret);
  const hashInBase64 = crypto.enc.Base64.stringify(hash);
  return hashInBase64;
}

app.get("/pay-with-esewa", (req, res, next) => {
  let order_price = req.query.price;
  let tax_amount = 0;
  let amount = order_price;
  let transaction_uuid = generateRandomString();
  let product_code = "EPAYTEST";
  let product_service_charge = 0;
  let product_delivery_charge = 0;
  let secretKey = "YOUR_SECRET_KEY_FOR_PAYMENT";
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
            <input type="text" id="product_delivery_charge" name="product_delivery_charge" value="${product_delivery_charge}" required>\
            <input type="text" id="success_url" name="success_url" value="http://localhost:3000/success" required>
            <input type="text" id="failure_url" name="failure_url" value="http://localhost:3000/failure" required>
            <input type="text" id="signed_field_names" name="signed_field_names" value="total_amount,transaction_uuid,product_code" required>
            <input type="text" id="signature" name="signature" value="${signature}" required>
            <input value="Submit" type="submit">
         </form>
    </body>
    `);
});

app.get("/failure", (req, res) => {
  return res.status(400).json({ message: "Payment failed.", success: false });
});

app.get("/success", (req, res) => {
  return res
    .status(201)
    .json({ message: "Payment successful.", success: true });
});

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server is listning on port : ${process.env.PORT || 3000}`);
});
