import { ItemBought, ActiveItem, ItemListed, ItemCancelled } from './../generated/schema';
import { Address, BigInt } from "@graphprotocol/graph-ts"
import {
  NftMarketplace,
  ItemBought as ItemBoughtEvent,
  ItemCancelled as ItemCancelledEvent,
  ItemListed as ItemListedEvent
} from "../generated/NftMarketplace/NftMarketplace"

export function handleItemBought(event: ItemBoughtEvent): void {
  const ID = getIdFromEventParams(event.params.tokenId,event.params.nftAddress)
  let itemBought = ItemBought.load(ID)
  let activeItem = ActiveItem.load(ID)
  if(!itemBought) {
    itemBought = new ItemBought(ID)
  }
  itemBought.buyer=event.params.buyer
  itemBought.nftAddress=event.params.nftAddress
  itemBought.tokenId=event.params.tokenId
  activeItem!.buyer=event.params.buyer
  itemBought.save()
  activeItem!.save()
}

export function handleItemCancelled(event: ItemCancelledEvent): void {
  const ID = getIdFromEventParams(event.params.tokenId,event.params.nftAddress)
  let itemCancelled = ItemCancelled.load(ID)
  let activeItem = ActiveItem.load(ID)
  if(!itemCancelled) {
    itemCancelled = new ItemCancelled(ID)
  }

  itemCancelled.seller=event.params.seller
  itemCancelled.nftAddress=event.params.nftAddress
  itemCancelled.tokenId=event.params.tokenId
  activeItem!.buyer = Address.fromString("0x000000000000000000000000000000000000dEaD") // dead address

  itemCancelled.save()
  activeItem!.save()
}

export function handleItemListed(event: ItemListedEvent): void {
  const ID = getIdFromEventParams(event.params.tokenId,event.params.nftAddress)
  let itemListed = ItemListed.load(ID)
  let activeItem = ActiveItem.load(ID)
  if(!itemListed) {
    itemListed = new ItemListed(ID)
  }
  if(!activeItem) {
    activeItem = new ActiveItem(ID)  
  }
  itemListed.seller=event.params.seller
  activeItem.seller=event.params.seller
  itemListed.nftAddress=event.params.nftAddress
  activeItem.nftAddress=event.params.nftAddress
  itemListed.tokenId=event.params.tokenId
  activeItem.tokenId=event.params.tokenId
  itemListed.price=event.params.price
  activeItem.price=event.params.price
  activeItem.buyer = Address.fromString("0x0000000000000000000000000000000000000000")
  itemListed.save()
  activeItem.save()
}

function getIdFromEventParams(tokenId:BigInt,nftAddress:Address): string {
  return tokenId.toHexString() + nftAddress.toHexString()
}