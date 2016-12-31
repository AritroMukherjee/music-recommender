'use strict';

angular
	.module('recommendationList')
	.component('recommendationList', {
		templateUrl: 'rec-list/recommendation-list.html',
		controller: function RecommendationController($http) {
			$http.get('/recommendations?user=a').then((response) => {
				// each has explanation and music
				this.recommendations = response.data.list;
			});
		}
});
