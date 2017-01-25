'use strict';

angular
	.module('recommendationList')
	.component('recommendationList', {
		templateUrl: 'rec-list/recommendation-list.html',
		controller: function RecommendationController($http, User) {
			const user = User.getCurrent();
			$http.get(`/recommendations?user=${user}`).then((response) => {
				// each has explanation and music
				this.recommendations = response.data.list;
			});
		}
	});
