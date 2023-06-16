import ProductComponent from "@/components/productComponent/ProductComponent";
import { productType } from "@/components/see-products/SeeProducts";
import { db } from "@/firebaseConfig";
import { collection, getDocs, query } from "firebase/firestore";

export async function generateStaticParams() {
  const count = query(collection(db, "products"));
  const querySnapshot = await getDocs(count);
  const data: productType[] = []
  for (var i = 0; i < querySnapshot.size; i++) {
    data.push({ id: querySnapshot.docs[i].id, data: querySnapshot.docs[i].data() } as productType)
  }
  return data.map(product => ({
    id:product.id,
    name:product.data.name,
    keywords:product.data.keywords,
    category:product.data.category,
    description:product.data.description,
    discountPrice:product.data.discountPrice,
    photoPath:product.data.photoPath,
    photoURL:product.data.photoURL,
    price:product.data.price,
    quantity:product.data.quantity
  }))
}


export default function page({ params: { id } }: { params: { id: string } }) {

  return (
    <ProductComponent params={{
      id: id
    }} />
  )
}
