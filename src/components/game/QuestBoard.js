import React from 'react'
import QuestCard from './QuestCard'
import HazardQuestCard from './HazardQuestCard'
import TreasureQuestCard from './TreasureQuestCard'
import ArtifactQuestCard from './ArtifactQuestCard'

const QuestBoard = () => {
  return (
    <div className="p-2 flex flex-wrap bg-red-300 items-center justify-center mx-auto text-center">
      <QuestCard>
        1<HazardQuestCard />
      </QuestCard>
      <p>&rarr;</p>
      <QuestCard>
        2<TreasureQuestCard />
      </QuestCard>
      <p>&rarr;</p>
      <QuestCard>
        3<ArtifactQuestCard />
      </QuestCard>
      <p>&rarr;</p>
      <QuestCard>
        4<TreasureQuestCard />
      </QuestCard>
      <p>&rarr;</p>
      <QuestCard>
        5<HazardQuestCard />
      </QuestCard>
      <p>&rarr;</p>
      <QuestCard>
        6<TreasureQuestCard />
      </QuestCard>
      <p>&rarr;</p>
      <QuestCard>
        7<ArtifactQuestCard />
      </QuestCard>
      <p>&rarr;</p>
      <QuestCard>
        8<TreasureQuestCard />
      </QuestCard>
      <p>&rarr;</p>
      <QuestCard>
        9<HazardQuestCard />
      </QuestCard>
      <p>&rarr;</p>
      <QuestCard>
        10<TreasureQuestCard />
      </QuestCard>
    </div>
  )
}

export default QuestBoard