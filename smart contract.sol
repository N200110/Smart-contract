// SPDX-License-Identifier: UNLICENSED

pragma solidity >=0.7.0 <0.9.0;

contract SecureFruitSupplyChain {
    
    enum FruitQuality { Unknown, Poor, Fair, Good, Excellent }
    enum BatchStatus { Harvested, Packaged, Transported, Arrived, Sold }

    event Harvested(uint256 batchId, string fruitType, uint256 harvestDate, uint256 quantity);
    event Packaged(uint256 batchId, uint256 date, string conditions);
    event Transported(uint256 batchId, uint256 departureTime, uint256 estimatedArrivalTime);
    event Arrived(uint256 batchId, uint256 actualArrivalTime, string condition);
    event Sold(uint256 batchId, uint256 saleDate, uint256 price);
    event FeedbackGiven(uint256 batchId, string feedback);

    struct FarmerInfo {
        string fruitType;
        uint256 harvestDate;
        uint256 quantity;
    }

    struct PackagingInfo {
        uint256 date;
        string conditions;
    }

    struct TransportInfo {
        uint256 departureTime;
        uint256 estimatedArrivalTime;
    }

    struct RetailInfo {
        uint256 actualArrivalTime;
        string condition;
    }

    struct SaleInfo {
        uint256 saleDate;
        uint256 price;
    }

    struct FruitBatch {
        FarmerInfo farmerInfo;
        PackagingInfo packagingInfo;
        TransportInfo transportInfo;
        RetailInfo retailInfo;
        SaleInfo saleInfo;
        FruitQuality quality;
        BatchStatus status;
        string consumerFeedback;
        address owner;
    }

    mapping(uint256 => FruitBatch) batches;
    uint256 public nextBatchId;

    address public farmer;
    address public transporter;
    address public retailer;
    
    constructor(address _farmer, address _transporter, address _retailer) {
        farmer = _farmer;
        transporter = _transporter;
        retailer = _retailer;
    }

    function getBatchStatus(uint256 batchId) public view returns (BatchStatus) {
        return batches[batchId].status;
    }

    function getNextBatchId() public view returns (uint256) {
        return nextBatchId;
    }
    

    modifier onlyFarmer() {
        require(msg.sender == farmer, "Only the farmer is allowed");
        _;
    }

    modifier onlyTransporter() {
        require(msg.sender == transporter, "Only the transporter is allowed");
        _;
    }

    modifier onlyRetailer() {
        require(msg.sender == retailer, "Only the retailer is allowed");
        _;
    }

    // Harvesting
    function harvest(string memory fruitType, uint256 harvestDate, uint256 quantity) public onlyFarmer {
        batches[nextBatchId].farmerInfo = FarmerInfo(fruitType, harvestDate, quantity);
        batches[nextBatchId].status = BatchStatus.Harvested;
        batches[nextBatchId].owner = farmer;
        
        emit Harvested(nextBatchId, fruitType, harvestDate, quantity); // 触发事件

        nextBatchId++;
    }

    // Packaging
    function packageFruits(uint256 batchId, uint256 date, string memory conditions) public onlyFarmer {
        require(batches[batchId].status == BatchStatus.Harvested, "Batch is not in the harvested state");
        require(batches[batchId].owner == farmer, "You are not the owner");
        
        batches[batchId].packagingInfo = PackagingInfo(date, conditions);
        batches[batchId].status = BatchStatus.Packaged;

         emit Packaged(batchId, date, conditions); 

    }

    // Transportation
    function transport(uint256 batchId, uint256 departureTime, uint256 estimatedArrivalTime) public onlyTransporter {
        require(batches[batchId].status == BatchStatus.Packaged, "Batch is not in the packaged state");
        require(batches[batchId].owner == farmer, "You are not the owner");
        
        batches[batchId].transportInfo = TransportInfo(departureTime, estimatedArrivalTime);
        batches[batchId].status = BatchStatus.Transported;
        batches[batchId].owner = transporter;

        emit Transported(batchId, departureTime, estimatedArrivalTime);
    }

    // Arrival
    function confirmArrival(uint256 batchId, uint256 actualArrivalTime, string memory condition) public onlyRetailer {
        require(batches[batchId].status == BatchStatus.Transported, "Batch is not in the transported state");
        require(batches[batchId].owner == transporter, "You are not the owner");
        
        batches[batchId].retailInfo = RetailInfo(actualArrivalTime, condition);
        batches[batchId].status = BatchStatus.Arrived;
        batches[batchId].owner = retailer;

        emit Arrived(batchId, actualArrivalTime, condition);
    }

    // Sale
    function sellToConsumer(uint256 batchId, uint256 saleDate, uint256 price) public onlyRetailer {
        require(batches[batchId].status == BatchStatus.Arrived, "Batch is not in the arrived state");
        require(batches[batchId].owner == retailer, "You are not the owner");
        
        batches[batchId].saleInfo = SaleInfo(saleDate, price);
        batches[batchId].status = BatchStatus.Sold;

        emit Sold(batchId, saleDate, price);
    }

    // Consumer Feedback (no restrictions on who can give feedback)
    function giveFeedback(uint256 batchId, string memory feedback) public {
        require(batches[batchId].status == BatchStatus.Sold, "Batch is not in the sold state");
        batches[batchId].consumerFeedback = feedback;

        emit FeedbackGiven(batchId, feedback);
    }
}
