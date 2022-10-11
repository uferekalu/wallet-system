import randomstring from "randomstring";

const randomlyGeneratedString = () => {
  const generatedTransactionReference = randomstring.generate({
    length: 10,
    charset: "alphanumeric",
    capitalization: "uppercase",
  });

  return generatedTransactionReference;
};

export { randomlyGeneratedString };
