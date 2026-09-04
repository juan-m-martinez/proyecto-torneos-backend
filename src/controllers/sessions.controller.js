export const sessionsPlaceholder = (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Sessions endpoint preparado para próximas entregas"
  });
};
