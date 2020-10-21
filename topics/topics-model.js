const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

let topicSchema = mongoose.Schema({
	id : {type : String, required : true, unique : true},
	name : {type : String, required : true, unique : true},
	words : {type : [String], required : true, unique : false},
	creatorEmail : {type : String, required : true}
});

let Topics = mongoose.model("Topics", topicSchema);

const topicsModel = {
	get : function() {
		return Topics.find()
			.then( topics => {
				return topics;
			})
			.catch( err => {
				throw new Error(err);
			});
	},

	get_with_email : function(received_email) {
		return Topics.find({creatorEmail : received_email})
			.then(topics => {
				return topics;
			})
			.catch( err => {
				throw new Error(err);
			});
	},

	get_search : function (search_word) {
		return Topics.find({$or:[{name : search_word}, {words : search_word}]})
			.then (topics => {
				return topics;
			})
			.catch (err => {
				throw new Erro(err);
			});
	},

	post : function(newTopic) {
		return Topics.create(newTopic)
			.then( topic => {
				return topic;
			})
			.catch( err => {
				console.log(err);
				throw new Error(err);
			});
	},

	put : function(received_id, received_words) {
		return Topics.findOneAndUpdate({id : received_id}, {$set : {words : received_words}}, {new : true})
			.then(topic => {
				return topic;
			})
			.catch(err => {
				throw new Error(err);
			});
	},

	change_name : function(received_id, received_name) {
		return Topics.findOneAndUpdate({id : received_id}, {$set : {name : received_name}}, {new : true})
			.then(topic => {
				return topic;
			})
			.catch(err => {
				throw new Error(err);
			});
	},

	add_word : function(received_id, received_word) {
		var words_array = [];
		console.log(`Received id: ${received_id}`);
		return Topics.findOne({id : received_id})
			.then(topic => {
				words_array = topic.words;
				console.log("Original array");
				console.log(words_array);
				return words_array;
			})
			.then(array => {
				array.push(received_word);
				console.log("After adding: ");
				console.log(array);

				return Topics.findOneAndUpdate({id : received_id}, {$set : {words : array}}, {new : true})
					.then(topic => {
						return topic;
					})
					.catch(err => {
						throw new Error(err);
					});
			});
	},

	delete_word : function(received_id, received_word) {
		var words_array = [];
		return Topics.findOne({id : received_id})
			.then(topic => {
				words_array = topic.words;
				return words_array;
			})
			.then(array => {
				var found_matches = false;
				for (let i = 0; i < array.length; i++) {
					if (array[i] == received_word) {
						array.splice(i, 1);
						i-=1;
						found_matches = true;
					}
				}

				if(!found_matches) {
					throw new Error();
				}

				return Topics.findOneAndUpdate({id : received_id}, {$set : {words : array}}, {new : true})
					.then(topic => {
						return topic;
					})
					.catch(err => {
						throw new Error(err);
					});
			});
	},

	delete : function(received_id) {
		return Topics.findOneAndDelete({id : received_id})
			.then(topic => {
				return topic;
			})
			.catch( err => {
				throw new Error(err);
			});
	}
}

module.exports = {topicsModel};
