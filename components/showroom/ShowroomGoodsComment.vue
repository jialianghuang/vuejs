<template>
  <div class="showroom-goods-comment">
    <div class="goods-comment add-comment">
      <p class="add-name">
        <span class="add-user">{{ showroomBaseInfo.shortName }}</span>
      </p>
      <p id="comment-input" class="comment-input">
        <input
          v-model="curComment"
          @keyup.enter="addComment"
          :placeholder="nl('page_placeholder_write_comment')"
          type="text"
          class="substance"
        />
        <button @click="addComment" class="submit-comment">{{ nl('page_common_post').toLowerCase() }}</button>
      </p>
    </div>
    <div v-for="comment in commentList" :key="comment.commentId" class="goods-comment view-comment">
      <div class="line_one">
        <p class="add-name">
          <span class="add-user">{{ comment.shortName }}</span>
        </p>
        <p class="comment-content">
          <span class="content-name">{{ comment.name }}</span>
          <span class="content-desc">
            <az-icon
              v-if="comment.editable"
              @click="deleteComment(comment.commentId)"
              class="remove-comment"
              icon-class="icon-icon_style_gallery_off"
            />
            <span class="inner-desc">{{ comment.comment }}</span>
          </span>
        </p>
      </div>
      <p class="comment-time">{{ comment.time }}</p>
    </div>
    <div v-show="viewType == 'view_more' && commentInfo.length > 2" @click="toggleViewType" class="goods-view-more">
      {{ nl('page_common_view_more') }}
    </div>
    <div v-show="viewType == 'view_less' && commentInfo.length > 2" @click="toggleViewType" class="goods-view-less">
      {{ nl('page_common_view_less') }}
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'
export default {
  name: 'ShowroomGoodsComment',
  components: {},
  props: {
    favoriteId: {
      type: Number,
      default: 0
    },
    commentInfo: {
      type: Array,
      default: () => []
    },
    showroomGoodsIndex: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      curComment: '',
      viewType: 'view_more',
      addCommentPoint: false
    }
  },
  computed: {
    ...mapState('showroom', ['showroomBaseInfo', 'prodList']),
    commentList() {
      if (this.commentInfo.length < 3 || this.viewType == 'view_less') {
        return this.commentInfo
      } else {
        return this.commentInfo.slice(0, 2)
      }
    }
  },
  methods: {
    toggleViewType() {
      if (this.viewType == 'view_more') this.viewType = 'view_less'
      else this.viewType = 'view_more'
    },
    addComment() {
      if (!this.addCommentPoint) {
        this.setPoint('comment', 'post', 'click')
        this.addCommentPoint = true
      }
      const params = { showroom_id: this.showroomBaseInfo.showroomId, favorite_id: this.favoriteId, comment: this.curComment }
      this.$axios.$post(`/1.0/showroom/comment`, params).then((res) => {
        this.curComment = ''
        if (res.code == 0) {
          const tempProdList = JSON.parse(JSON.stringify(this.prodList))
          tempProdList[this.showroomGoodsIndex].commentInfo = res.data.list
          this.$store.commit('showroom/setProdList', tempProdList)
        } else if (res.code == 700200) {
          alert(res.msg)
          window.location.reload()
        } else if ([700201, 700202].includes(res.code)) {
          alert(res.msg)
          window.location.href = this.countryUrl('/')
        }
      })
    },
    deleteComment(commentId) {
      this.setPoint('comment', 'delete', 'click')
      const params = { showroom_id: this.showroomBaseInfo.showroomId, favorite_id: this.favoriteId, comment_id: commentId }
      this.$axios.$delete(`/1.0/showroom/comment`, { params }).then((res) => {
        if (res.code == 0) {
          const tempProdList = JSON.parse(JSON.stringify(this.prodList))
          tempProdList[this.showroomGoodsIndex].commentInfo = res.data.list
          this.$store.commit('showroom/setProdList', tempProdList)
        } else if (res.code == 700200) {
          alert(res.msg)
          window.location.reload()
        } else if ([700201, 700202].includes(res.code)) {
          alert(res.msg)
          window.location.href = this.countryUrl('/')
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
.showroom-goods-comment {
  padding: 0 10px;
  .add-comment {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 56px;
    line-height: 56px;
    .add-name {
      flex-shrink: 0;
      .add-user {
        margin-left: 0;
      }
    }
    .comment-input {
      height: 26px;
      line-height: 26px;
      margin-left: 5px;
      position: relative;
      flex: 1;
      .substance {
        width: 100%;
        flex-grow: 1;
        flex-shrink: 1;
        border: 1px solid var(--color-cccccc);
        padding: 0 10px;
        box-sizing: border-box;
        height: 26px;
        font-size: 13px;
        outline: none;
        &::placeholder {
          color: var(--color-cccccc);
        }
        &:focus {
          background-color: #ffffff;
          border-color: var(--color-121212);
        }
      }
      .submit-comment {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        right: 10px;
        padding: 0;
        border: 0;
        color: var(--color-121212);
        text-transform: uppercase;
        font-family: @font-family-600;
        font-size: 12px;
        &:focus,
        &:active {
          background-color: #fff;
        }
      }
    }
  }
  .view-comment {
    margin: -5px 0 20px;
    .line_one {
      display: flex;
      justify-content: flex-start;
      .add-name {
        flex-shrink: 0;
        .add-user {
          margin-left: 0;
          margin-right: 0;
        }
      }
      .comment-content {
        flex-grow: 1;
        flex-shrink: 1;
        margin: 0 0 0 5px;
      }
    }
    .comment-content {
      border-radius: 8px;
      width: 150px;
      border: 0;
      padding: 5px 10px;
      line-height: 18px;
      color: var(--color-666666);
      background-color: var(--color-f9f9f9);
      .content-name {
        text-transform: capitalize;
        color: var(--color-121212);
        line-height: 18px;
      }
      .content-desc {
        .inner-desc {
          color: var(--color-666666);
          word-break: break-word;
        }
        .remove-comment {
          width: 6px;
          height: 6px;
          overflow: hidden;
          // right: 15px;
          // top: 12px;
          // position: absolute;

          float: right;
          margin-top: 6px;
          margin-left: 5px;
          cursor: pointer;
          fill: var(--color-121212);
        }
      }
    }
    .comment-time {
      margin-left: 36px;
      display: block;
      color: var(--color-999999);
      font-size: 12px;
      margin: 5px 0 20px 26px + 15px;
    }
  }
  .goods-view-more,
  .goods-view-less {
    text-transform: capitalize;
    text-decoration: underline;
    cursor: pointer;
    text-align: center;
    padding: 0 0 20px 0;
    font-size: 12px;
    &.show {
      display: block;
    }
  }
  .add-name {
    position: relative;
    .add-user {
      margin-left: 10px;
      display: inline-block;
      border-radius: 50%;
      width: 26px;
      height: 26px;
      background-color: var(--color-ede1d3);
      text-align: center;
      line-height: 26px;
      color: white;
      font-family: @font-family-600;
    }
  }
  .goods-comment {
    position: relative;
    > p {
      display: inline-block;
    }
    &.template {
      display: none;
    }
  }
}
</style>
