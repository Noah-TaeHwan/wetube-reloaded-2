import Video from '../models/video';

export const home = async (req, res) => {
  const videos = await Video.find({}).sort({ createdAt: 'desc' });
  return res.render('home', { pageTitle: 'Home', videos });
};

export const watch = async (req, res) => {
  const { id } = req.params;
  try {
    const video = await Video.findById(id);
    return res.render('watch', { pageTitle: video.title, video });
  } catch (error) {
    return res.render('404', { pageTitle: `Not Found ${id}` });
  }
};

export const getEdit = async (req, res) => {
  const { id } = req.params;
  try {
    const video = await Video.findById(id);
    return res.render('edit', { pageTitle: `Edit: ${video.title}`, video });
  } catch (error) {
    return res.render('404', { pageTitle: `Not Found ${id}` });
  }
};

export const postEdit = async (req, res) => {
  const { id } = req.params;
  const { title, description, hashtags } = req.body;
  try {
    await Video.findByIdAndUpdate(id, {
      title,
      description,
      hashtags: Video.formatHashtags(hashtags),
    });
    return res.redirect(`/videos/${id}`);
  } catch (error) {
    return res.render('404', { pageTitle: `Not Found ${id}` });
  }
};

export const getUpload = (req, res) => {
  return res.render('upload', { pageTitle: 'Upload Video' });
};

export const postUpload = async (req, res) => {
  const { title, description, hashtags } = req.body;
  try {
    await Video.create({
      title,
      description,
      hashtags: Video.formatHashtags(hashtags),
    });
    return res.redirect('/');
  } catch (error) {
    return res.render('upload', {
      pageTitle: 'Upload Video',
      errorMessage: error._message,
    });
  }
};

export const deleteVideo = async (req, res) => {
  const { id } = req.params;
  try {
    await Video.findByIdAndDelete(id);
  } catch (error) {
    return res.render('404', { pageTitle: `Not Found ${id}` });
  }
  return res.redirect('/');
};

export const search = async (req, res) => {
  const { keyword } = req.query;
  let videos = [];
  if (keyword) {
    videos = await Video.find({
      title: {
        $regex: new RegExp(keyword, 'i'),
      },
    });
  }
  return res.render('search', { pageTitle: `Search`, videos });
};
