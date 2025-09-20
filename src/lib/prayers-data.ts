/**
 * Basic Catholic Prayers
 * Based on USCCB collection of essential prayers for the faithful
 */

export interface Prayer {
  id: string;
  title: string;
  latin?: string;
  text: string;
  category: 'foundational' | 'creeds' | 'devotional' | 'acts' | 'liturgical';
  description?: string;
}

export const BASIC_PRAYERS: Prayer[] = [
  // Foundational Prayers
  {
    id: 'sign-of-cross',
    title: 'Sign of the Cross',
    category: 'foundational',
    text: 'In the name of the Father,\nand of the Son,\nand of the Holy Spirit.\nAmen.',
    description: 'The fundamental prayer that begins and ends most Catholic prayers.'
  },
  {
    id: 'our-father',
    title: 'Our Father',
    latin: 'Pater Noster',
    category: 'foundational',
    text: 'Our Father, who art in heaven,\nhallowed be thy name;\nthy kingdom come,\nthy will be done\non earth as it is in heaven.\nGive us this day our daily bread,\nand forgive us our trespasses,\nas we forgive those who trespass against us;\nand lead us not into temptation,\nbut deliver us from evil.\nAmen.',
    description: 'The prayer Jesus taught his disciples, also known as the Lord\'s Prayer.'
  },
  {
    id: 'hail-mary',
    title: 'Hail Mary',
    latin: 'Ave Maria',
    category: 'foundational',
    text: 'Hail Mary, full of grace,\nthe Lord is with thee.\nBlessed art thou amongst women,\nand blessed is the fruit of thy womb, Jesus.\nHoly Mary, Mother of God,\npray for us sinners,\nnow and at the hour of our death.\nAmen.',
    description: 'The beloved prayer to the Blessed Virgin Mary.'
  },
  {
    id: 'glory-be',
    title: 'Glory Be',
    latin: 'Gloria Patri',
    category: 'foundational',
    text: 'Glory be to the Father,\nand to the Son,\nand to the Holy Spirit,\nas it was in the beginning,\nis now, and ever shall be,\nworld without end.\nAmen.',
    description: 'The doxology that gives glory to the Trinity.'
  },
  {
    id: 'guardian-angel',
    title: 'Prayer to Guardian Angel',
    category: 'foundational',
    text: 'Angel of God,\nmy guardian dear,\nto whom God\'s love\ncommits me here,\never this day,\nbe at my side,\nto light and guard,\nrule and guide.\nAmen.',
    description: 'A prayer seeking protection and guidance from one\'s guardian angel.'
  },
  {
    id: 'morning-offering',
    title: 'Morning Offering',
    category: 'foundational',
    text: 'O Jesus, through the Immaculate Heart of Mary,\nI offer you my prayers, works, joys, and sufferings\nof this day for all the intentions\nof your Sacred Heart,\nin union with the Holy Sacrifice of the Mass\nthroughout the world,\nin reparation for my sins,\nfor the intentions of all my relatives and friends,\nand in particular for the intentions of the Holy Father.\nAmen.',
    description: 'A prayer to offer the day\'s activities to God.'
  },
  {
    id: 'act-of-contrition',
    title: 'Act of Contrition',
    category: 'foundational',
    text: 'My God,\nI am sorry for my sins with all my heart.\nIn choosing to do wrong\nand failing to do good,\nI have sinned against you\nwhom I should love above all things.\nI firmly intend, with your help,\nto do penance,\nto sin no more,\nand to avoid whatever leads me to sin.\nOur Savior Jesus Christ\nsuffered and died for us.\nIn his name, my God, have mercy.\nAmen.',
    description: 'A prayer of repentance and resolution to avoid sin.'
  },

  // Creeds
  {
    id: 'apostles-creed',
    title: 'Apostles\' Creed',
    category: 'creeds',
    text: 'I believe in God,\nthe Father almighty,\nCreator of heaven and earth,\nand in Jesus Christ, his only Son, our Lord,\nwho was conceived by the Holy Spirit,\nborn of the Virgin Mary,\nsuffered under Pontius Pilate,\nwas crucified, died and was buried;\nhe descended into hell;\non the third day he rose again from the dead;\nhe ascended into heaven,\nand is seated at the right hand of God the Father almighty;\nfrom there he will come to judge the living and the dead.\nI believe in the Holy Spirit,\nthe holy catholic Church,\nthe communion of saints,\nthe forgiveness of sins,\nthe resurrection of the body,\nand life everlasting.\nAmen.',
    description: 'The ancient statement of Christian faith.'
  },
  {
    id: 'nicene-creed',
    title: 'Nicene Creed',
    category: 'creeds',
    text: 'I believe in one God,\nthe Father almighty,\nmaker of heaven and earth,\nof all things visible and invisible.\nI believe in one Lord Jesus Christ,\nthe Only Begotten Son of God,\nborn of the Father before all ages.\nGod from God, Light from Light,\ntrue God from true God,\nbegotten, not made, consubstantial with the Father;\nthrough him all things were made.\nFor us men and for our salvation\nhe came down from heaven,\nand by the Holy Spirit was incarnate of the Virgin Mary,\nand became man.\nFor our sake he was crucified under Pontius Pilate,\nhe suffered death and was buried,\nand rose again on the third day\nin accordance with the Scriptures.\nHe ascended into heaven\nand is seated at the right hand of the Father.\nHe will come again in glory\nto judge the living and the dead\nand his kingdom will have no end.\nI believe in the Holy Spirit, the Lord, the giver of life,\nwho proceeds from the Father and the Son,\nwho with the Father and the Son is adored and glorified,\nwho has spoken through the prophets.\nI believe in one, holy, catholic and apostolic Church.\nI confess one Baptism for the forgiveness of sins\nand I look forward to the resurrection of the dead\nand the life of the world to come.\nAmen.',
    description: 'The creed professed at Sunday Mass and major feasts.'
  },

  // Devotional Prayers
  {
    id: 'angelus',
    title: 'The Angelus',
    category: 'devotional',
    text: 'V. The Angel of the Lord declared unto Mary.\nR. And she conceived of the Holy Spirit.\nHail Mary, full of grace...\n\nV. Behold the handmaid of the Lord.\nR. Be it done unto me according to your word.\nHail Mary, full of grace...\n\nV. And the Word was made flesh.\nR. And dwelt among us.\nHail Mary, full of grace...\n\nV. Pray for us, O holy Mother of God.\nR. That we may be made worthy of the promises of Christ.\n\nLet us pray:\nPour forth, we beseech you, O Lord,\nyour grace into our hearts,\nthat we to whom the Incarnation of Christ your Son\nwas made known by the message of an Angel,\nmay by his Passion and Cross\nbe brought to the glory of his Resurrection.\nThrough the same Christ our Lord.\nAmen.',
    description: 'Traditional prayer commemorating the Incarnation, prayed at 6 AM, noon, and 6 PM.'
  },
  {
    id: 'hail-holy-queen',
    title: 'Hail, Holy Queen',
    latin: 'Salve Regina',
    category: 'devotional',
    text: 'Hail, holy Queen, Mother of mercy,\nhail, our life, our sweetness, and our hope.\nTo you we cry, the children of Eve;\nto you we send up our sighs,\nmourning and weeping in this land of exile.\nTurn, then, most gracious advocate,\nyour eyes of mercy toward us;\nlead us home at last\nand show us the blessed fruit of your womb, Jesus:\nO clement, O loving, O sweet Virgin Mary.\nV. Pray for us, O holy Mother of God.\nR. That we may be made worthy of the promises of Christ.',
    description: 'Ancient Marian antiphon expressing devotion to the Blessed Virgin Mary.'
  },
  {
    id: 'memorare',
    title: 'Memorare',
    category: 'devotional',
    text: 'Remember, O most gracious Virgin Mary,\nthat never was it known\nthat anyone who fled to your protection,\nimplored your help, or sought your intercession\nwas left unaided.\nInspired by this confidence,\nI fly unto you,\nO Virgin of virgins, my Mother;\nto you do I come;\nbefore you I stand, sinful and sorrowful.\nO Mother of the Word Incarnate,\ndespise not my petitions,\nbut in your mercy hear and answer me.\nAmen.',
    description: 'A beautiful prayer seeking Mary\'s intercession, attributed to St. Bernard.'
  },
  {
    id: 'anima-christi',
    title: 'Anima Christi',
    latin: 'Anima Christi',
    category: 'devotional',
    text: 'Soul of Christ, sanctify me.\nBody of Christ, save me.\nBlood of Christ, inebriate me.\nWater from Christ\'s side, wash me.\nPassion of Christ, strengthen me.\nO good Jesus, hear me.\nWithin your wounds hide me.\nSuffer me not to be separated from you.\nFrom the malicious enemy defend me.\nIn the hour of my death call me,\nand bid me come unto you,\nthat I may praise you with your saints\nand angels forever and ever.\nAmen.',
    description: 'Prayer to Jesus Christ, often prayed after receiving Communion.'
  },

  // Spiritual Acts
  {
    id: 'act-of-faith',
    title: 'Act of Faith',
    category: 'acts',
    text: 'O my God,\nI firmly believe\nthat you are one God in three divine Persons,\nFather, Son, and Holy Spirit.\nI believe that your divine Son became man\nand died for our sins and that he will come\nto judge the living and the dead.\nI believe these and all the truths\nwhich the Holy Catholic Church teaches\nbecause you have revealed them\nwho are eternal truth and wisdom,\nwho can neither deceive nor be deceived.\nIn this faith I intend to live and die.\nAmen.',
    description: 'Prayer expressing faith in God and the teachings of the Church.'
  },
  {
    id: 'act-of-hope',
    title: 'Act of Hope',
    category: 'acts',
    text: 'O Lord God,\nI hope by your grace for the pardon\nof all my sins\nand after life here to gain eternal happiness\nbecause you have promised it\nwho are infinitely powerful, faithful, kind,\nand merciful.\nIn this hope I intend to live and die.\nAmen.',
    description: 'Prayer expressing hope in God\'s mercy and eternal life.'
  },
  {
    id: 'act-of-love',
    title: 'Act of Love',
    category: 'acts',
    text: 'O Lord God, I love you above all things\nand I love my neighbor for your sake\nbecause you are the highest, infinite and perfect good,\nworthy of all my love.\nIn this love I intend to live and die.\nAmen.',
    description: 'Prayer expressing love for God and neighbor.'
  },

  // Liturgical Prayers
  {
    id: 'regina-caeli',
    title: 'Regina Caeli',
    latin: 'Regina Caeli',
    category: 'liturgical',
    text: 'Queen of Heaven, rejoice, alleluia.\nFor he whom you did merit to bear, alleluia.\nHas risen, as he said, alleluia.\nPray for us to God, alleluia.\n\nV. Rejoice and be glad, O Virgin Mary, alleluia.\nR. For the Lord has truly risen, alleluia.\n\nLet us pray:\nO God, who gave joy to the world\nthrough the resurrection of your Son our Lord Jesus Christ,\ngrant we beseech you,\nthat through the intercession of the Virgin Mary, his Mother,\nwe may obtain the joys of everlasting life.\nThrough the same Christ our Lord.\nAmen.',
    description: 'Marian antiphon prayed during Easter season instead of the Angelus.'
  }
];

export const PRAYER_CATEGORIES = [
  { id: 'foundational', name: 'Foundational Prayers', description: 'Essential prayers every Catholic should know' },
  { id: 'creeds', name: 'Creeds', description: 'Statements of faith professed by the Church' },
  { id: 'devotional', name: 'Devotional Prayers', description: 'Traditional prayers for personal devotion' },
  { id: 'acts', name: 'Spiritual Acts', description: 'Acts of faith, hope, and love' },
  { id: 'liturgical', name: 'Liturgical Prayers', description: 'Prayers used in liturgical worship' }
];

export function getPrayersByCategory(category: Prayer['category']): Prayer[] {
  return BASIC_PRAYERS.filter(prayer => prayer.category === category);
}

export function getPrayerById(id: string): Prayer | undefined {
  return BASIC_PRAYERS.find(prayer => prayer.id === id);
}