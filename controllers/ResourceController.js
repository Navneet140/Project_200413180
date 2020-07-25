// INSTRUCTIONS:
/*
  Create a new resource controller that uses the
  User as an associative collection (examples):
  - User -> Books
  - User -> Reservation

  The resource controller must contain the 7 resource actions:
  - index
  - show
  - new
  - create
  - edit
  - update
  - delete
*/

const viewPath = 'resources';
const Resource = require('../models/Resource');
const User = require('../models/User');

exports.index = async (req, res) => {
  try {
    const resources = await Resource
      .find()
      .populate('user')
      .sort({updatedAt: 'desc'});

      res.status(200).json(resources);
  } catch (error) {
    res.status(400).json({message: 'There was an error fetching the resource', error});
  }
};

exports.show = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id)
      .populate('user');
      res.status(200).json(resource);
    
  } catch (error) {
    res.status(400).json({message: "There was an error fetching the Resource"});
  }
};

exports.new = (req, res) => {
  res.render(`${viewPath}/new`, {
    pageTitle: 'New Resource'
  });
};

exports.create = async (req, res) => {
  console.log(req.body);
  try {
    const { user: email } = req.session.passport;
    const user = await User.findOne({email: email});

    const resource = await Resource.create({user: user._id, ...req.body});

    res.status(200).json(resource);
  } catch (error) {
    res.status(400).json({message: "There was an error creating the resource", error});
  }
};

exports.edit = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);
    res.render(`${viewPath}/edit`, {
      pageTitle: resource.title,
      formData: resource
    });
  } catch (error) {
    req.flash('danger', `There was an error accessing this resource: ${error}`);
    res.redirect('/');
  }
};

exports.update = async (req, res) => {
  try {
    const { user: email } = req.session.passport;
    const user = await User.findOne({email: email});

    let resource = await Resource.findById(req.body.id);
    if (!resource) throw new Error('Blog could not be found');

    const attributes = {user: user._id, ...req.body};
    await resource.validate(attributes);
    await Resource.findByIdAndUpdate(attributes.id, attributes);

    req.flash('success', 'The resource was updated successfully');
    res.redirect(`/resources/${req.body.id}`);
  } catch (error) {
    req.flash('danger', `There was an error updating this resource: ${error}`);
    res.redirect(`/resources/${req.body.id}/edit`);
  }
};

exports.delete = async (req, res) => {
  try {
    await Resource.deleteOne({_id: req.body.id});
    res.status(200).json({message: "Deleted!"});
  } catch (error) {
    res.status(400).jason({message: "Oops! Got an Error"});
  }
};