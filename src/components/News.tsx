import { LoremIpsum } from 'react-lorem-ipsum'

interface INews {}

const News = ({}: INews) => {
  return (
    <div className="news">
      <div className="items">
        {[...Array(4)].map((x, i) => (
          <div key={i} className="item">
            <LoremIpsum
              startWithLoremIpsum={false}
              avgSentencesPerParagraph={1}
              avgWordsPerSentence={5}
              p={1}
            />
            <LoremIpsum startWithLoremIpsum={false} p={1} avgSentencesPerParagraph={3} />
          </div>
        ))}
      </div>
    </div>
  )
}

export default News