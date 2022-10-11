import randomstring from "randomstring";

const randomlyGeneratedString = (value: number) => {
  const generatedTransactionReference = randomstring.generate({
    length: value,
    charset: "alphanumeric",
    capitalization: "uppercase",
  });

  return generatedTransactionReference;
};

export { randomlyGeneratedString };
