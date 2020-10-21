const express = require('express');
const uuidv4 = require('uuid/v4');
const router = express.Router();
const {topicsModel} = require('./topics-model');

router.all('/*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

//Next is added instead of ".send('Finish'), que los vergas no usamos, in order to finish the
//execution and send only one message"
router.get('/list-topics', (req, res, next) => {
	topicsModel.get()
		.then( topics => {
			res.status(200).json({
				message : "Successfully sent the list of topics",
				status : 200,
				topics : topics
			});
		}).catch( err => {
			res.status(500).json({
				message : "Internal server error",
				status : 500
			});
			return next();
		});
});

router.get('/list-topics/:email', (req, res, next) => {
	let received_email = req.params.email;
	topicsModel.get_with_email(received_email)
		.then( topics => {
			if(topics.length > 0) {
				res.status(200).json({
					message: "Successfully sent the list of topics",
					status : 200,
					topics : topics
				});
			}
			else {
				res.status(404).json({
					message: "Topic not found in the list",
					status: 404
				});
			}
		})
		.catch(err => {
			res.status(500).json({
				message: "Internal server error",
				status : 500
			});
			return next();
		});
});

router.get('/search-topics/:word', (req, res, next) => {

	if(req.params.word) {
		topicsModel.get_search(req.params.word)
		.then(topics => {
			if(topics.length > 0) {
				res.status(200).json({
					message : "Successfully found topics",
					status : 200,
					topics : topics
				});
				return next();
			}
			else {
				res.status(404).json({
					message : "Topics not found",
					status : 404
				});
				return next();
			}
		})
		.catch(err => {
			res.status(500).json({
				message: "Internal server error",
				status : 500
			});
			return next();
		});
	}
	else {
		res.status(406).json({
				message : `Missing word in params.`,
				status : 406
			});
	}

});

router.post('/post-topic', (req, res, next) => {
	let requiredFields = ['name', 'words', 'creatorEmail'];

	for (let i = 0; i < requiredFields.length; i++) {
		let currentField = requiredFields[i];
		if (!(currentField in req.body)) {
			res.status(406).json({
				message : `Missing field ${currentField} in body.`,
				status : 406
			});
			return next();
		}
	}

	let topicToAdd = {
		id: uuidv4(),
		name: req.body.name,
		words: req.body.words,
		creatorEmail: req.body.creatorEmail
	}

	topicsModel.post(topicToAdd)
		.then(topic => {
			res.status(201).json({
				message : "Successfully added the topic",
				status : 201,
				topic : topic
			});
		})
		.catch(err => {
			console.log(err);
			res.status(500).json({
				message: "Internal server error",
				status : 500
			});
			return next();
		});
});

router.put('/update-words/:id', (req, res, next) => {
	let received_id = req.params.id;
	let received_words = req.body.words;

	let requiredFields = ['words'];
	for ( let i = 0; i < requiredFields.length; i ++){
		let currentField = requiredFields[i];
		if (! (currentField in req.body)){
			res.status(406).json({
				message : `Missing field ${currentField} in body.`,
				status : 406
			});
			return next();
		}
	}

	if (received_id) {
		topicsModel.put(received_id, received_words)
			.then( topics => {
				if (topics) {
					res.status(200).json({
						message : "Successfully modified words on topic",
						status : 200,
						topic : topics
					});
					return next();
				}
				else {
					res.status(404).json({
						message : "Topic not found in the list",
						status : 404
					});
					return next();
				}
			})
			.catch( err => {
				res.status(500).json({
					message: "Internal server error",
					status : 500
				});
				return next();
			});
	}
	else {
		res.status(406).json({
				message : `Missing new words in body`,
				status : 406
			});
	}
});

router.put('/update-name/:id', (req, res, next) => {
	let received_id = req.params.id;

	let requiredFields = ['name'];
	for ( let i = 0; i < requiredFields.length; i ++){
		let currentField = requiredFields[i];
		if (! (currentField in req.body)){
			res.status(406).json({
				message : `Missing field ${currentField} in body.`,
				status : 406
			});
			return next();
		}
	}

	if (received_id) {
		topicsModel.change_name(received_id, req.body.name)
			.then( topics => {
				if(topics) {
					res.status(200).json({
						message: "Successfully modified the name of topic",
						status : 200,
						topics : topics
					});
				}
				else {
					res.status(404).json({
						message: "Topic not found in the list",
						status: 404
					});
				}
			})
			.catch(err => {
				res.status(500).json({
					message: "Internal server error",
					status : 500
				});
				return next();
			});
	}
	else {
		res.status(406).json({
			message : `Missing ID parameter`,
			status : 406
		});
	}
});

router.put('/add-word/:id', (req, res, next) => {
	let received_id = req.params.id;
	let requiredFields = ['word'];
	for ( let i = 0; i < requiredFields.length; i ++){
		let currentField = requiredFields[i];
		if (! (currentField in req.body)){
			res.status(406).json({
				message : `Missing field ${currentField} in body.`,
				status : 406
			});
			return next();
		}
	}

	if (received_id) {
		topicsModel.add_word(received_id, req.body.word)
			.then( topics => {
				if(topics) {
					res.status(200).json({
						message: "Successfully added the word to topic",
						status : 200,
						topics : topics
					});
				}
				else {
					res.status(404).json({
						message: "Topic not found in the list",
						status: 404
					});
				}
			})
			.catch(err => {
				console.log(err);
				res.status(500).json({
					message: "Internal server error",
					status : 500
				});
				return next();
			});
	}
	else {
		res.status(406).json({
			message : `Missing ID parameter`,
			status : 406
		});
	}
});

router.delete('/remove-word/:id', (req, res, next) => {
	let received_id = req.params.id;
	let requiredFields = ['word'];
	for ( let i = 0; i < requiredFields.length; i ++){
		let currentField = requiredFields[i];
		if (! (currentField in req.body)){
			res.status(406).json({
				message : `Missing field ${currentField} in body.`,
				status : 406
			});
			return next();
		}
	}

	if (received_id) {
		topicsModel.delete_word(received_id, req.body.word)
			.then( topics => {
				if(topics) {
					res.status(200).json({
						message: "Successfully removed the word from topic",
						status : 200,
						topics : topics
					});
				}
				else {
					res.status(404).json({
						message: "Topic not found in the list",
						status: 404
					});
				}
			})
			.catch(err => {
				console.log(err);
				res.status(500).json({
					message: "Internal server error",
					status : 500
				});
				return next();
			});
	}
	else {
		res.status(406).json({
			message : `Missing ID parameter`,
			status : 406
		});
	}
});

router.delete('/remove-topic/:id', (req, res, next) => {
	let requiredFields = ['id'];

	for ( let i = 0; i < requiredFields.length; i ++){
		let currentField = requiredFields[i];

		if (! (currentField in req.body)){
			res.status(406).json({
				message : `Missing field ${currentField} in body.`,
				status : 406
			});
			return next();
		}
	}

	let topicID = req.params.id;

	if (topicID) {
		if (topicID == req.body.id) {
			topicsModel.delete(topicID)
				.then(topic => {
					if (topic) {
						res.status(204).json({
							message : "Successfully deleted the topic",
							status : 204,
						});
						return next();
					}
					else {
						res.status(404).json({
							message : "Topic not found in the list",
							status : 404
						});
						return next();
					}
				})
				.catch( err => {
					res.status(500).json({
						message: "Internal server error",
						status : 500
					});
					return next();
				});
		}
		else {
			res.status(406).json({
				message : `Different entered IDs`,
				status : 406
			});
			return next();
		}
	}
});

module.exports = router;
