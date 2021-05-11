export default (req, res):void => {
  if (req.method === 'POST') {
    res.send("Post..");
  } else {
    res.send("Get..");
  }
}