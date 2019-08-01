<template>
    <div>
        <div
            class="drag-area mb-4 flex justify-center items-center select-none"
            :class="{ 'is-dropping': isDropping }"
            @dragover.prevent
            @dragenter.prevent="isDropping = true"
            @dragleave.prevent="isDropping = false"
            @drop.prevent="onDrop"
        >
            {{ dropText }}
        </div>

        <div
            v-show="images.length"
            class="bg-90 grid p-4"
        >
            <div
                v-for="image in images"
                :key="image.link"
            >
                <img
                    :src="image.link"
                    :alt="image.title"
                />
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data: () => ({
        isDropping: false,
        isUploading: false,
        apiUrl: 'https://api.imgur.com/3/',
        albumId: 'iYcdUzw',
        deleteHash: 'csjFtvY03dHZv6v', // Use this hash to delete anonymus album
        images: [],
        imgurHeaders: {
            'Authorization': 'Client-ID 3400edef22af8f0',
        },
        dropText: 'Drop image here',
    }),
    created() {
        this.getAlbumImages();
    },
    methods: {
        getAlbumImages() {
            this.request('GET', `${this.apiUrl}album/${this.albumId}/images`)
            .then(res => {
                this.images = res.data.data;
            });
        },

        request(method, url, data = null) {
            this.enableLoading();
            const instance = axios.create();

            // Laravel sets this headers. Imgur api throw cors errors if this headers are present
            delete instance.defaults.headers.common['X-CSRF-TOKEN'];
            delete instance.defaults.headers.common['X-Requested-With'];

            return instance({
                url,
                method,
                data,
                headers: this.imgurHeaders,
            })
            .then(res => {
                this.disableLoading();
                return res;
            })
            .catch(err => {
                // Request error handler
                this.disableLoading();
                alert(err.response.data.error);
            });
        },

        enableLoading() {
            this.isUploading = true;
            this.dropText = 'Loading...';
        },

        disableLoading() {
            this.isUploading = false;
            this.dropText = 'Drop image here';
        },

        onDrop(e) {
            e.stopPropagation();
            this.isDropping = false;
            if (!this.isUploading) {
                this.sendFileToApi(e.dataTransfer.files[0]);
            }
        },

        sendFileToApi(file) {
            if (!this.validateFile(file)) {
                return;
            }

            const reader = new FileReader();
            reader.onload = (e) => {
                const base64 = e.target.result.split(',')[1];
                const imgData = {
                    image: base64,
                    title: file.name,
                    type: 'base64',
                    album: this.deleteHash,
                };

                this.request('POST', `${this.apiUrl}image`, imgData).then(res => {
                    this.images.push(res.data.data);
                });
            }
            reader.readAsDataURL(file);
        },

        validateFile(file) {
            if (!file || !file.type.match('image.*')) {
                alert('Select an image');
                return false;
            }

            // Imgur allows image at max 10 MB
            if (file.size > 10000000) {
                alert('Image is too big. Maximum 10 MB allowed');
                return false;
            }

            return true;
        },
    },
}
</script>

<style scoped>
/* Scoped Styles */
.grid {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    grid-auto-rows: 150px;
    grid-gap: 1rem;
    position: relative;
    border-radius: 8px;
    min-height: 150px;
}

img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.drag-area {
    width: 100%;
    height: 150px;
    border-radius: 8px;
    background-color: white;
    position: relative;
    font-weight: 600;
    color: black;
}

.is-dropping {
    border: 2px dashed orange;
}
</style>
