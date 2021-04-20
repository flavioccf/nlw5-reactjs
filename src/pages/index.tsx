export default function Home(props) {
  return (
      <h1>Hello World</h1>
    )
}

// SERVER SIDE RENDERING
// export async function getServerSideProps() {

// STATIC SITE GENERATION
export async function getStaticProps() {
  const response = await fetch('http://localhost:3333/episodes');
  const data = await response.json();

  return {
    props: {
      episodes: data
    },
    revalidate: 60 * 60 * 8
  };
}