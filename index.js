import { debounce } from 'lodash'

const prefix = 'vue-simple-persist-'

// Set a computed property to automatically store in localStorage
// https://vuejs.org/v2/guide/mixins.html
export default {

	computed: {

		// NOTE: This can be undefined especially for non-components
		persistKey () {
			return this.$options.name
		}

	},

	watch: {

		// Store serialized data into localStorage when it changes (throttled)
		// NOTE: need to use `function` so `this` won't get messed up
		persist: debounce(function (data) {
			if (!process.server) {
				if (this.persistKey) {
					localStorage.setItem(prefix + this.persistKey, JSON.stringify(data))
				}
			}
		}, 500)

	},

	created () {
		if (!process.server) {
			if (this.persistKey && this.persist) {

				// Load serialized data from localStorage
				// NOTE: this is a synchronous operation, theoretically it might slow things down
				var data = localStorage.getItem(prefix + this.persistKey)

				if (data) {
					try {
						data = JSON.parse(data)

						// We found data in local storage, let's load it up
						if (data) {
							this.persist = data

							// Fire event
							this.$emit('localstorage-loaded', data)

						}

					} catch (error) {
						console.error(error)
					}
				}

			}
		}
	}

}
