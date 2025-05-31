package com.hsh.project.pojo;

import com.hsh.project.pojo.enums.EnumHashtagStatus;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Hashtag extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long hashtagID;

    String tag;

    Integer totalPost;

    @Enumerated(EnumType.STRING)
    EnumHashtagStatus status;

    @OneToMany(mappedBy = "hashtag")
    List<UserHashtag> userHashtags;

    @OneToMany(mappedBy = "hashtag")
    List<ReviewHashtag> reviewHashtags;

}
