// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

/**
 * @title Media posts
 */
contract Posts{
    address public owner; //contract owner/admin
    uint256 private postCount; //number of posts (also serves as post id)

    struct Post {
        address payable creator;
        uint256 id;
        string text;
        string img;
        uint256 tipGenerated; // amount of tip given to this post
    }
    mapping(uint256=>Post) posts;

    event postCreated(
        address creator,
        uint256 id,
        string text,
        string img,
        uint256 tipGenerated
    );
    event postTipped(uint256 id, uint256 amount);

    constructor(){
        postCount =0;
        owner = msg.sender;
    }

     /**
    * @notice Creates a new post on chain.
    * @param _txt text content of post
    * @param _img image attached to the post
    */
    function createPost(string memory _txt, string memory _img) public {
        postCount++;
        Post storage newPost = posts[postCount];
        newPost.creator = payable(msg.sender);
        newPost.id = postCount;
        newPost.text = _txt;
        newPost.img = _img;
        newPost.tipGenerated= 0;
        emit postCreated(msg.sender,newPost.id,newPost.text,newPost.img,newPost.tipGenerated); 
    }

    // @dev returns a specific post
    // @param id id of post (must be valid)
    function getPost(uint256 id)public view returns(Post memory){
        require(id <= postCount && id>0, "invalid id");
        Post memory post = posts[id];
        return post;
    }

    //@dev returns total number of posts
    function getPostCount() public view returns(uint256){
        return postCount;
    }

    //@dev tips the creator of a specific post
    function tip(uint256 id)public payable{
        require(id>0 && id<=postCount,"invalid id");
        Post storage _post = posts[id];
        address payable creator  = _post.creator;
        creator.transfer(msg.value);
        _post.tipGenerated += msg.value;
        emit postTipped(id,msg.value);
    }
}